import React, { useEffect, useState } from 'react';
import '../styles/App.scss';
import '../styles/spinning-record.css';
import axios from 'axios';
import {useHistory } from 'react-router-dom';
import RecordTile from './RecordTile';

function RandomRecordGenerator(props) {

    const [records, setRecords] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState({});
    const [generating, setGenerating] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('Any');
    const history = useHistory();

    useEffect(() => {
        // make sure user is logged in
        if (!props.user || !props.user._id) {
            history.push('/login');
        }

        // fetch all records for this user
        axios
            .get(`http://localhost:8082/api/records?userId=${props.user._id}`)
            .then(res => {
                setRecords(res.data);
            })
            .catch(err => {
                console.log('Error from RandomRecordGenerator');
            })
    }, []);

    const onFilterChange = e => {
        setSelectedGenre(e.target.value);
        setSelectedRecord(null);
    };

    const hasGenre = (genre) => {
        if (genre === "Favorites") {
            return records.filter(rec => rec.favorite === true).length > 0;
        }
        else if (genre === "60s") {
            return records.filter(rec => rec.year >= 1960 && rec.year < 1970).length > 0;
        }
        else if (genre === "70s") {
            return records.filter(rec => rec.year >= 1970 && rec.year < 1980).length > 0;
        }
        else if (genre === "80s") {
            return records.filter(rec => rec.year >= 1980 && rec.year < 1990).length > 0;
        }
        else if (genre === "90s") {
            return records.filter(rec => rec.year >= 1990).length > 0;
        }
        else if (genre === "Favorites") {
            return records.filter(rec => rec.favorite === true).length > 0;
        }
        else {
            return records.filter(rec => rec.genre === genre).length > 0;
        } 
    }

    const generateRecord = () => {
        if (records.length) {
            var nameIndex = Math.floor(Math.random() * records.length);
            var filteredRecords = JSON.parse(JSON.stringify(records));

            if (selectedGenre !== 'Any') {
                if (selectedGenre === '60s') {
                    filteredRecords = filteredRecords.filter(rec => rec.year >= 1960 && rec.year < 1970);
                }
                else if (selectedGenre === '70s') {
                    filteredRecords = filteredRecords.filter(rec => rec.year >= 1970 && rec.year < 1980);
                }
                else if (selectedGenre === '80s') {
                    filteredRecords = filteredRecords.filter(rec => rec.year >= 1980 && rec.year < 1990);
                }
                else if (selectedGenre === '90s') {
                    filteredRecords = filteredRecords.filter(rec => rec.year >= 1990);
                }
                else if (selectedGenre === 'Favorites') {
                    filteredRecords = filteredRecords.filter(rec => rec.favorite === true);
                }
                else {
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
                                    onChange={onFilterChange}
                                >
                                    <option value="Any">Any</option>
                                    {
                                        props.genres.map(genre => {
                                            return hasGenre(genre) && <option value={genre}>{genre}</option>
                                        })
                                    }
                                    {hasGenre("60s") && <option value="60s">60s</option>}
                                    {hasGenre("70s") && <option value="70s">70s</option>}
                                    {hasGenre("80s") && <option value="80s">80s</option>}
                                    {hasGenre("90s") && <option value="90s">90s to Present</option>}
                                    {hasGenre("Favorites") && <option value="Favorites">Favorites</option>}
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
                        <div className={generating ? "tile-wrapper hidden-wrapper" : "tile-wrapper"}>
                        {selectedRecord && selectedRecord.title && <RecordTile record={selectedRecord} key={selectedRecord.title} />}
                        </div>
                        <div><strong className="text-danger">{errorMessage}</strong></div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default RandomRecordGenerator;