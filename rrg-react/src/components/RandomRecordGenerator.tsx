import React, { ChangeEventHandler, useEffect, useState } from 'react';
import axios from 'axios';

import RecordTile from './RecordTile';
import { Record } from '../types/record';
import { User } from '../types/user';
import genres from '../types/genres';

import '../styles/App.scss';
import '../styles/record-generator.scss';
import '../styles/spinning-record.css';

type RandomRecordGenerator = {
    baseUrl: string,
    user: User,
    hasGenre(genre: string, records: Record[]): boolean,
    setManageActive(): void,
    checkLogin(): void
  };

const RandomRecordGenerator: React.FC<RandomRecordGenerator> = (props) => {

    const [records, setRecords] = useState<Record[]>([]);
    const [recordsLoaded, setRecordsLoaded] = useState<boolean>(false);
    const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
    const [generating, setGenerating] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [selectedGenre, setSelectedGenre] = useState<string>('Any');

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
                console.log("Error from RandomRecordGenerator");
            })
    }, []);

    const onFilterChange: ChangeEventHandler<HTMLSelectElement> = e => {
        setSelectedGenre(e.target.value);
        setSelectedRecord(null);
    };

    const generateRecord = () => {
        if (records.length) {
            var nameIndex: number = Math.floor(Math.random() * records.length);
            var filteredRecords: Record[] = JSON.parse(JSON.stringify(records));

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
                    setSelectedRecord(null);
                    setErrorMessage('Record could not be generated. Try changing your filter.');
                    return;
                }

                nameIndex = Math.floor(Math.random() * filteredRecords.length);
            }

            setSelectedRecord(null);
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
        props.user &&
        <div className="random-record-generator">
            <div className="container mb-5">
                <div className="row">
                    <div className="col-md-8 m-auto text-center">
                        <h1 className="display-5">Random Record Generator</h1>
                        {!recordsLoaded &&
                            <div className="text-center loading-records">
                                Loading Records...
                            </div>
                        }
                        {recordsLoaded &&
                        <>
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
                                            genres.map(genre => {
                                                return props.hasGenre(genre, records) && 
                                                    <option value={genre} key={genre}>{genre}</option>
                                            })
                                        }
                                        {props.hasGenre("Pre-1960", records) && <option value="Pre-1960">Pre-1960</option>}
                                        {props.hasGenre("1960s", records) && <option value="1960s">1960s</option>}
                                        {props.hasGenre("1970s", records) && <option value="1970s">1970s</option>}
                                        {props.hasGenre("1980s",records) && <option value="1980s">1980s</option>}
                                        {props.hasGenre("1990s", records) && <option value="1990s">1990s</option>}
                                        {props.hasGenre("2000 to Present", records) && <option value="2000 to Present">2000 to Present</option>}
                                        {props.hasGenre("Favorites", records) && <option value="Favorites">Favorites</option>}
                                    </select>
                                </div>
                            </form>

                            <button className="btn btn-warning btn-lg mt-2" onClick={generateRecord}>
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
                        </>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RandomRecordGenerator;