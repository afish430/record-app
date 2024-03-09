import { useEffect, useState } from 'react';
import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import RecordTile from './RecordTile';
import { Record } from '../types/record';
import { User } from '../types/user';

import '../styles/App.scss';
import '../styles/record-stats.scss';
import '../styles/spinning-record.css';

type RecordStatsProps = {
    baseUrl: string,
    user: User,
    genres: string[],
    setCurrentUser(user: User): void,
    setManageActive(): void,
    checkLogin(): void
};

type RecordStatistics = {
    recordCount?: number,
    artistCount?: number,
    genreCount?: number,
    oldestRecord?: Record,
    newestRecord?: Record
};

const RecordStats: React.FC<RecordStatsProps> = (props) => {

    const [records, setRecords] = useState<Record[]>([]);
    const [recordsLoaded, setRecordsLoaded] = useState<boolean>(false);
    const [recordStats, setRecordStats] = useState<RecordStatistics>({});

    useEffect(() => {
        props.checkLogin();
        // fetch all records for this user:
        axios.get(props.baseUrl + "/records",
                {
                    headers: {
                        token: localStorage.getItem("jwt") || ""
                    }
                })
            .then(res => {
                setRecords(res.data);
                setRecordsLoaded(true);
            })
            .catch(err => {
                console.log('Error from RecordStats');
            })
    }, []);

    useEffect(() => {
        calculateStats();
    }, [records]);

    const calculateStats = () => {
        const recordCount: number = records.length;
        const artists: string[] = [];
        const genres: string[] = [];
        let artistCount: number = 0;
        let genreCount: number = 0;
        let oldestRecord: Record = records[0];
        let newestRecord: Record = records[0];
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
        const genreCounts: any = {};
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
        let recordsByDecade: any[] = [
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
        let artistCounts: any = {};
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
        if (records.length > 100)
        {
            topArtists = topArtists.slice(0, 20);
        }
        else{
            topArtists = topArtists.slice(0, 10);
        }
        
        return topArtists;
    };

    const getGenresPieChartOptions = (type: any) => ({
        chart: {
          type,
          margin: 30,
          maxHeight: 450
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
        ],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    chart: {
                        margin: 30,
                        height: 250
                    },
                    title: {
                        margin: 10
                    },
                    plotOptions: {
                        pie: {
                          dataLabels: {
                            style: {
                              fontSize: 9,
                            }
                          }
                        }
                    }
                }
            }]
        }
    });

    const getDecadesBarChartOptions = (type: any) => ({
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
        ],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    chart: {
                        marginTop: 30,
                        marginBottom: 70,
                        height: 350
                      },
                    title: {
                        margin: 10
                      },
                }
            }]
        }
    });

    const getTopArtistsChartOptions = (type: any) => ({
        chart: {
          type,
          marginLeft: 150,
          marginRight: 100,
          height: 500
        },
        title: {
          text: "Top " + getTopArtists().length + " Artists",
          margin: 10
        },
        legend: {
            enabled: false
        },
        xAxis: {
            categories: getTopArtists().map(artist => artist.name)
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
                // @ts-ignore 
                let recordsByArtist: Record[] = records.filter(rec => rec.artist === this.x);
                recordsByArtist.sort((a, b) => a.year - b.year);
                let recordsByArtistText: string[] = recordsByArtist.map(rec => rec.title + ' (' + rec.year + ')');
                let recordText: string = recordsByArtistText.length === 1 ? " Record" : " Records";
                // @ts-ignore 
                let tooltipText: string = '<b>' + this.y + recordText + ' by ' + this.x + '</b>:<br>';
                recordsByArtistText.forEach(title => {
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
                    <div className="col-md-9 m-auto text-center">
                        <h1 className="display-5">Record Statistics</h1>
                        {!recordsLoaded &&
                        <div className="text-center loading-records">
                            Loading Records...
                        </div>}
                        {recordsLoaded && !records.length &&
                        <div className="text-center loading-records">
                            You need to add some records to your collection to see your stats!
                        </div>}
                        {recordsLoaded && records.length > 0 &&
                        <>
                            <div className="chart-div">
                                <HighchartsReact highcharts={Highcharts} options={getGenresPieChartOptions('pie')} />
                                <HighchartsReact highcharts={Highcharts} options={getDecadesBarChartOptions('column')} />
                                <HighchartsReact highcharts={Highcharts} options={getTopArtistsChartOptions('bar')} />
                            </div>
                            {
                                recordStats.oldestRecord && recordStats.newestRecord &&
                                <>
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
                                </>
                            }
                        </>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecordStats;