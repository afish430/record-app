import React, { useEffect, useState } from 'react';
import '../styles/App.scss';
import '../styles/spinning-record.css';
import axios from 'axios';
import RecordTile from './RecordTile';

function RandomRecordGenerator(props) {

    const [records, setRecords] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState({});
    const [generating, setGenerating] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('AllButSpecialty');

    useEffect(() => {
        axios
            .get('http://localhost:8082/api/records')
            .then(res => {
                setRecords(res.data);
            })
            .catch(err => {
                console.log('Error from RandomRecordGenerator');
            })
    }, []);

    const onChange = e => {
        setSelectedGenre(e.target.value);
    };

    const generateRecord = () => {
        if (records.length) {
            var nameIndex = Math.floor(Math.random() * records.length);
            var filteredRecords = JSON.parse(JSON.stringify(records));

            if (selectedGenre !== 'Any') {
                if (selectedGenre === 'AllButSpecialty') {
                    filteredRecords = filteredRecords.filter(rec => rec.genre !== 'Holiday' && rec.genre !== 'Childrens');
                } else {
                    filteredRecords = filteredRecords.filter(rec => rec.genre === selectedGenre);
                } 
                if (filteredRecords.length === 0) {
                    setSelectedRecord({});
                    setErrorMessage('Record could not be generated. Try changing your filter.');
                    return;
                }

                nameIndex = Math.floor(Math.random() * filteredRecords.length);
            }

            setSelectedRecord({});
            setGenerating(true);
            setErrorMessage('');

            setTimeout(() => {
                setSelectedRecord(filteredRecords[nameIndex]);
                setGenerating(false);
            }, 2500);

        } else {
            setErrorMessage('Record could not be generated.');
        }
    };

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
                                    value={selectedGenre}
                                    onChange={onChange}
                                >
                                    <option value="AllButSpecialty">Any (Non Specialty)</option>
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
                            className="btn btn-warning btn-lg m-2"
                            onClick={generateRecord}
                        >
                            Generate Record!
                        </button>
                        {generating && <div className="text-center mt-4">
                            <svg viewBox="0 0 400 400">
                                <defs>
                                <linearGradient id="yellowRedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0" className="start-color"/>
                                    <stop offset="1" className="end-color"/>
                                </linearGradient>
                                </defs>
                                <g id="record">
                                    <circle className="line" r="200" cx="200" cy="200" />
                                    <circle r="198" cx="200" cy="200" />
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
                        {selectedRecord && selectedRecord.title && <RecordTile record={selectedRecord} key={selectedRecord.title} />}
                        <div><strong className="text-danger">{errorMessage}</strong></div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default RandomRecordGenerator;