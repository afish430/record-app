import React, { Component } from 'react';
import '../styles/App.scss';
import '../styles/spinning-record.css';
import axios from 'axios';
import RecordTile from './RecordTile';

class RandomRecordGenerator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            records: [],
            selectedRecord: {},
            generating: false,
            errorMessage: '',
            selectedGenre: 'Any'
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

    onChange = e => {
        this.setState({
            selectedGenre: e.target.value,
        });
    };

    generateRecord = () => {
        if (this.state.records.length) {
            var nameIndex = Math.floor(Math.random() * this.state.records.length);
            var filteredRecords = JSON.parse(JSON.stringify(this.state.records));

            if (this.state.selectedGenre !== 'Any') {
                filteredRecords = filteredRecords.filter(rec => rec.genre === this.state.selectedGenre);
                if (filteredRecords.length === 0) {
                    this.setState({
                        selectedRecord: {},
                        errorMessage: 'Record could not be generated. Try changing your filter.',
                    });
                    return;
                }

                nameIndex = Math.floor(Math.random() * filteredRecords.length);
            }

            this.setState({
                selectedRecord: {},
                generating: true,
                errorMessage: ''
            });

            setTimeout(() => {
                this.setState({
                    selectedRecord: filteredRecords[nameIndex],
                    generating: false
                });
            }, 2500);

        } else {
            this.setState({
                errorMessage: 'Record could not be generated.',
            });
        }

    };

    render() {
        return (
            <div className="RandomRecordGenerator">
                <div className="container mb-5">
                    <div className="row">
                        <div className="col-md-8 m-auto text-center">
                            <h1 className="display-5">Random Record Generator</h1>
                            <form className="form-inline justify-content-center">
                                <div className='form-group'>
                                    <label htmlFor="favorite">Filter by Genre:</label>
                                    <select
                                        className="form-control ml-3"
                                        name="genre"
                                        value={this.state.selectedGenre}
                                        onChange={this.onChange}
                                    >
                                        <option value="Any">Any</option>
                                        <option value="Classic Rock">Classic Rock</option>
                                        <option value="Rock">Rock</option>
                                        <option value="Folk">Folk</option>
                                        <option value="Country">Country</option>
                                        <option value="Pop">Pop</option>
                                        <option value="Soul">Soul</option>
                                        <option value="Reggae">Reggae</option>
                                        <option value="Holiday">Holiday</option>
                                        <option value="Childrens">Children's</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </form>
                            <br />
                            <button
                                className="btn btn-info btn-lg m-2"
                                onClick={this.generateRecord}
                            >
                                Generate Record!
                            </button>
                            {this.state.generating && <div className="text-center mt-4">
                                <svg viewBox="0 0 400 400">
                                    <g id="record">
                                        <circle r="200" cx="200" cy="200" />
                                        <circle className="line" r="180" cx="200" cy="200" />
                                        <circle className="line" r="160" cx="200" cy="200" />
                                        <circle className="line" r="140" cx="200" cy="200" />
                                        <circle id="label" cx="200" cy="200" r="65" />
                                        <text y="180" x="165">Record is</text>
                                        <text y="230" x="160">Generating</text>
                                        <circle id="dot" cx="200" cy="200" r="6" />
                                    </g>

                                </svg>
                            </div>}
                            {this.state.selectedRecord && this.state.selectedRecord.title && <RecordTile record={this.state.selectedRecord} key={this.state.selectedRecord.title} />}
                            <div><strong className="text-danger">{this.state.errorMessage}</strong></div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
};

export default RandomRecordGenerator;