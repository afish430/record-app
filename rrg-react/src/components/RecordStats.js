import React, { useEffect, useState } from 'react';
import {useHistory } from 'react-router-dom';
import RecordTile from './RecordTile';
import '../styles/App.scss';
import '../styles/spinning-record.css';
import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function RecordStats(props) {

    const [records, setRecords] = useState([]);
    const [recordStats, setRecordStats] = useState({});
    const history = useHistory();
      

    useEffect(() => {
        // make sure user is logged in
        axios.get(`http://localhost:8082/api/auth/loggedInUser`,
                {
                    headers: {
                        token: localStorage.getItem("jwt")
                    }
                })
            .then(res => {
                if (!res.data.user && (!props.user || !props.user._id)) {
                    history.push('/login');
                } else {
                    if (res.data.newToken) {
                        localStorage.setItem("jwt", res.data.newToken);
                    }
                    props.setCurrentUser(res.data.user)
                }
            })
            .catch(err => {
                history.push('/login');
            })

        // fetch all records for this user
        axios
            .get(`http://localhost:8082/api/records`,
                {
                    headers: {
                        token: localStorage.getItem("jwt")
                    }
                })
            .then(res => {
                setRecords(res.data);
            })
            .catch(err => {
                console.log('Error from RecordStats');
            })
    }, []);

    useEffect(() => {
        calculateStats();
    }, [records]);

    const calculateStats = () => {
        const recordCount = records.length;
        const artists = [];
        const genres = [];
        let artistCount = 0;
        let genreCount = 0;
        let oldestRecord = records[0];
        let newestRecord = records[0];
        records.forEach(rec => {
            if (!artists.includes(rec.artist)) {
                artistCount++;
                artists.push(rec.artist);
            }
            if (!genres.includes(rec.genre)) {
                genreCount++;
                genres.push(rec.genre);
            }
            if (rec.year < oldestRecord.year) {
                oldestRecord = rec;
            }
            if (rec.year > newestRecord.year) {
                newestRecord = rec;
            }
        });

        setRecordStats({
            recordCount,
            artistCount,
            genreCount,
            oldestRecord,
            newestRecord
        });
    }

    const getRecordsByGenre = () => {
        const genreCounts = {};
        records.forEach(rec => {
            if (genreCounts[rec.genre] !== undefined) {
                genreCounts[rec.genre]++;
            }
            else {
                genreCounts[rec.genre] = 1;
            }
        });

        const recordsByGenre = [];
        for (const key in genreCounts) {
            recordsByGenre.push({name: key, y: genreCounts[key]})
        }
        return recordsByGenre;
    };

    const getRecordsByDecade = () => {
        let recordsByDecade = [
            { name: "Pre-1940", y: records.filter(rec => rec.year < 1940).length },
            { name: "1940s", y: records.filter(rec => rec.year >= 1940 && rec.year < 1950).length },
            { name: "1950s", y: records.filter(rec => rec.year >= 1950 && rec.year < 1960).length },
            { name: "1960s", y: records.filter(rec => rec.year >= 1960 && rec.year < 1970).length },
            { name: "1970s", y: records.filter(rec => rec.year >= 1970 && rec.year < 1980).length },
            { name: "1980s", y: records.filter(rec => rec.year >= 1980 && rec.year < 1990).length },
            { name: "1990s", y: records.filter(rec => rec.year >= 1990 && rec.year < 2000).length },
            { name: "2000s", y: records.filter(rec => rec.year >= 2000 && rec.year < 2010).length },
            { name: "2010s", y: records.filter(rec => rec.year >= 2010 && rec.year < 2020).length },
            { name: "2020s", y: records.filter(rec => rec.year >= 2020).length },
        ];

        recordsByDecade = recordsByDecade.filter(decade => decade.y > 0);
        return recordsByDecade;
    };

    const getTopArtists = () => {
        let artistCounts = {};
        records.forEach(rec => {
            if (artistCounts[rec.artist] !== undefined) {
                artistCounts[rec.artist]++;
            }
            else {
                artistCounts[rec.artist] = 1;
            }
        });

        let topArtists = [];
        for (const key in artistCounts) {
            topArtists.push({name: key, y: artistCounts[key]})
        }

        topArtists.sort((a, b) => b.y - a.y);
        topArtists = topArtists.slice(0, 10);
        
        return topArtists;
    };

    const getGenresPieChartOptions = (type) => ({
        chart: {
          type,
          margin: 30,
          height: 450
        },
        title: {
          text: "Records by Genre",
          margin: 200
        },
        yAxis: {
          title: {
            text: 'Values',
          },
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },
        series: [
          {
            name: 'Count',
            colorByPoint: true,
            data: getRecordsByGenre(),
          }
        ]
    });

    const getDecadesBarChartOptions = (type) => ({
        chart: {
          type,
          marginLeft: 100,
          marginRight: 100,
          height: 450
        },
        title: {
          text: "Records by Decade",
          margin: 10
        },
        legend: {
            enabled: false
        },
        xAxis: {
            categories: getRecordsByDecade().map(decade => decade.name),
            title: {
                text: 'Decade'
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Record Count'
            },
            endOnTick: false
        },
        series: [
          {
            name: 'Count',
            colorByPoint: true,
            data: getRecordsByDecade(),
          }
        ]
    });

    const getTopArtistsChartOptions = (type) => ({
        chart: {
          type,
          marginLeft: 150,
          marginRight: 100,
          height: 500
        },
        title: {
          text: "Top Artists",
          margin: 10
        },
        legend: {
            enabled: false
        },
        xAxis: {
            categories: getTopArtists().map(artist => artist.name),
            title: {
                text: 'Bands/Artists'
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Record Count'
            },
            endOnTick: false
        },
        series: [
          {
            name: 'Count',
            colorByPoint: true,
            data: getTopArtists(),
          }
        ],
        tooltip: {
            formatter: function() {
                let recordsByArtist = records.filter(rec => rec.artist === this.x);
                recordsByArtist.sort((a, b) => a.year - b.year);
                recordsByArtist = recordsByArtist.map(rec => rec.title + ' (' + rec.year + ')');
                let tooltipText = '<b>' + this.y + ' Records by ' + this.x + '</b>:<br>';
                recordsByArtist.forEach(title => {
                    tooltipText += '<i>' + title + '</i><br>';
                })
                return tooltipText;
            }
        }
    });

    return (
        <div className="record-stats">
            <div className="container mb-5">
                <div className="row">
                    <div className="col-md-8 m-auto text-center">
                        <h1 className="display-5">Record Statistics</h1>
                        <div className="chart-div">
                            <HighchartsReact highcharts={Highcharts} options={getGenresPieChartOptions('pie')} />
                            <HighchartsReact highcharts={Highcharts} options={getDecadesBarChartOptions('column')} />
                            <HighchartsReact highcharts={Highcharts} options={getTopArtistsChartOptions('bar')} />
                        </div>
                        {
                            recordStats.oldestRecord && recordStats.newestRecord &&
                            <div>
                                <div className="oldest-newest">
                                    <div>
                                        <p>Oldest Record*:</p>
                                        <RecordTile
                                            record={recordStats.oldestRecord}
                                            showFooter={false}
                                        />
                                    </div>
                                    <div>
                                        <p>Newest Record*:</p>
                                        <RecordTile
                                            record={recordStats.newestRecord}
                                            showFooter={false}
                                        />
                                    </div>
                                </div>
                                <p className="asterisk">*May not reflect ties (records released in the same year)</p>
                                <br></br>
                                <p>Total Records: {recordStats.recordCount}</p>
                                <p>Total Artists: {recordStats.artistCount}</p>
                                <p>Total Genres: {recordStats.genreCount}</p>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>

    )
}

export default RecordStats;