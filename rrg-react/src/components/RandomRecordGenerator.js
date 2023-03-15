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
                console.log('Error from RandomRecordGenerator');
            })
    }, []);

    const onFilterChange = e => {
        setSelectedGenre(e.target.value);
        setSelectedRecord(null);
    };

    const generateRecord = () => {
        if (records.length) {
            var nameIndex = Math.floor(Math.random() * records.length);
            var filteredRecords = JSON.parse(JSON.stringify(records));

            if (selectedGenre !== 'Any') {
                if (selectedGenre === 'Pre-1960') {
                    filteredRecords = filteredRecords.filter(rec => rec.year < 1960);
                }
                else if (selectedGenre === '1960s') {
                    filteredRecords = filteredRecords.filter(rec => rec.year >= 1960 && rec.year < 1970);
                }
                else if (selectedGenre === '1970s') {
                    filteredRecords = filteredRecords.filter(rec => rec.year >= 1970 && rec.year < 1980);
                }
                else if (selectedGenre === '1980s') {
                    filteredRecords = filteredRecords.filter(rec => rec.year >= 1980 && rec.year < 1990);
                }
                else if (selectedGenre === '1990s') {
                    filteredRecords = filteredRecords.filter(rec => rec.year >= 1990 && rec.year < 2000);
                }
                else if (selectedGenre === '2000 to Present') {
                    filteredRecords = filteredRecords.filter(rec => rec.year >= 2000);
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
                                            return props.hasGenre(genre, records) && 
                                                <option value={genre} key={genre}>{genre}</option>
                                        })
                                    }
                                    {props.hasGenre("Pre-1960", records) && <option value="Pre-1960">Pre-1960</option>}
                                    {props.hasGenre("1960s", records) && <option value="1960s">1960s</option>}
                                    {props.hasGenre("1970s", records) && <option value="1970s">1970s</option>}
                                    {props.hasGenre("1980s",records) && <option value="1980s">1980s</option>}
                                    {props.hasGenre("1990s", records) && <option value="1990s">1990s</option>}
                                    {props.hasGenre("2000 t0 Present", records) && <option value="2000 t0 Present">2000 to Present</option>}
                                    {props.hasGenre("Favorites", records) && <option value="Favorites">Favorites</option>}
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