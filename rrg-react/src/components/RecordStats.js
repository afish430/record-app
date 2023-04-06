import React, { useEffect, useState } from 'react';
import {useHistory } from 'react-router-dom';
import '../styles/App.scss';
import '../styles/spinning-record.css';
import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function RecordStats(props) {

    const [records, setRecords] = useState([]);
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
                        console.log("updating local storage");
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

    const getGenresPieChartOptions = (type) => ({
        chart: {
          type,
          margin: 30
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
                allowPointSelect: true,
                cursor: 'pointer',
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
    });

    const getRecordsByGenre = () => {
        const genreCounts = {};
        records.forEach(rec => {
            if (genreCounts[rec.genre] !== undefined) {
                genreCounts[rec.genre]++;
            }
            else {
                genreCounts[rec.genre] = 0;
            }
        })

        const recordsByGenre = [];
        for (const key in genreCounts) {
            recordsByGenre.push({name: key, y: genreCounts[key]})
        }
        return recordsByGenre;
    };

    return (
        <div className="RecordStats">
            <div className="container mb-5">
                <div className="row">
                    <div className="col-md-8 m-auto text-center">
                        <h1 className="display-5">Record Statistics</h1>
                        <div className="chartDiv">
                            <HighchartsReact highcharts={Highcharts} options={getGenresPieChartOptions('pie')} />
                        </div>
                        <h2 className="display-5">More coming soon!</h2>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default RecordStats;