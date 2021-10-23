import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import RecordTile from './RecordTile';

class RandomRecordGenerator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            records: [],
            selectedRecord: {},
            message: ''
        };
    }

    componentDidMount() {
        axios
            .get('http://localhost:8082/api/records')
            .then(res => {
                this.setState({
                    records: res.data
                })
            })
            .catch(err => {
                console.log('Error from RandomRecordGenerator');
            })
    };

    generateRecord = () => {
        if (this.state.records.length) {
            var nameIndex = Math.floor(Math.random() * this.state.records.length);

            this.setState({
                selectedRecord: {},
                message: 'Generating Record...'
            });

            setTimeout(() => {
                this.setState({
                    selectedRecord: this.state.records[nameIndex],
                    message: ''
                });
            }, 2500);

        } else {
            alert('Record could not be generated');
        }

    };

    render() {
        return (
            <div className="RandomRecordGenerator">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto text-center">
                            <h1 className="display-5">Random Record Generator</h1>
                            <br />
                            <button
                                className="btn btn-info btn-lg m-2"
                                onClick={this.generateRecord}
                            >
                                Generate Record!
                            </button>
                            {this.state.message && <div className="text-center mt-4">
                                <svg viewBox="0 0 400 400">
                                    <g id="record">
                                        <circle r="200" cx="200" cy="200" />
                                        <circle className="line" r="180" cx="200" cy="200" />
                                        <circle className="line" r="160" cx="200" cy="200" />
                                        <circle className="line" r="140" cx="200" cy="200" />
                                        <circle id="label" cx="200" cy="200" r="65" />
                                        <text y="180" x="165">Record Is</text>
                                        <text y="230" x="160">Generating</text>
                                        <circle id="dot" cx="200" cy="200" r="6" />
                                    </g>

                                </svg>
                            </div>}
                            {this.state.selectedRecord.title && <RecordTile record={this.state.selectedRecord} key={this.state.selectedRecord.title} />}
                        </div>
                    </div>
                </div>
            </div>

        )
    }
};

export default RandomRecordGenerator;