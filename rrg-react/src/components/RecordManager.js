import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import RecordTile from './RecordTile';

class RecordManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            records: []
        };
    }

    componentDidMount() {
        axios
            .get('http://localhost:8082/api/records')
            .then(res => {
                this.setState({
                    records: res.data.sort(this.sortByArtist)
                })
            })
            .catch(err => {
                console.log('Error from RecordManager');
                console.log(err);
            })
    };

    removeRecord = (id) => {
        console.log(this.state.records);
        console.log("removing record " + id);
        this.setState({
            records: this.state.records.filter(rec => rec._id !== id)
        });
        console.log(this.state.records);
    }

    sortByArtist = (a, b) => {
        let artistA = a.artist;
        let artistB = b.artist;

        if (artistA.split(' ')[0] === 'The') {
            artistA = artistA.slice(4);
        }

        if (artistB.split(' ')[0] === 'The') {
            artistB = artistB.slice(4);
        }

        if (artistA < artistB) {
            return -1;
        }
        if (artistA > artistB) {
            return 1;
        }
        return 0;
    }

    render() {
        const records = this.state.records;
        let recordList;

        if (!records) {
            recordList = "there is no record!";
        } else {
            recordList = records.map((record, k) =>
                <RecordTile record={record} removeRecord={this.removeRecord} showFooter={true} key={k} />
            );
        }

        return (
            <div className="RecordManager">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h1 className="display-5 text-center">Manage Records</h1>
                        </div>
                        <div className="col-md-12">
                            <Link to="/add-record" className="btn btn-warning float-right">
                                + Add New Record
                            </Link>
                            <br />
                        </div>

                    </div>

                    <div className="list">
                        {recordList}
                    </div>
                </div>
            </div>
        );
    }
}

export default RecordManager;