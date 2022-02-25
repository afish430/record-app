import React, { useState, useEffect } from 'react';
import '../styles/App.scss';
import axios from 'axios';
import { Link } from 'react-router-dom';
import RecordTile from './RecordTile';

function RecordManager() {
    const [records, setRecords] = useState([]);
    // const [selectedGenre, setSelectedGenre] = useState([]);

    useEffect(() => {
        axios
            .get('http://localhost:8082/api/records')
            .then(res => {
                let sortedRecords = res.data.sort(sortByArtist);
                let filteredRecords = sortedRecords.filter(r => r.genre !== 'Holiday' && r.genre !== 'Childrens');
                setRecords(filteredRecords);
            })
            .catch(err => {
                console.log('Error from RecordManager');
                console.log(err);
            })
    }, []);

    const removeRecord = (id) => {
        setRecords(records.filter(rec => rec._id !== id));
    }

    const sortByArtist = (a, b) => {
        let artistA = a.artist;
        let artistB = b.artist;

        // don't consider "The" when sorting
        if (artistA.split(' ')[0] === 'The') {
            artistA = artistA.slice(4);
        }

        if (artistB.split(' ')[0] === 'The') {
            artistB = artistB.slice(4);
        }

        // sort by artist name, then by year
        if (artistA < artistB) {
            return -1;
        }
        else if (artistA > artistB) {
            return 1;
        }
        else if (a.year < b.year) {
            return -1;
        }
        else if (a.year > b.year) {
            return 1;
        }
        return 0;
    }

    // const onChange = e => {
    //     setSelectedGenre(e.target.value);
    // };

    return (
        <div className="RecordManager">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h1 className="display-5 text-center">Manage Records</h1>
                    </div>
                    <div className="col-md-12">
                        {/* <form className="form-inline justify-content-center">
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
                        </form> */}
                        <Link to="/add-record" className="btn btn-warning float-right">
                            + Add New Record
                        </Link>
                        <br />
                    </div>

                </div>

                <div className="list">
                    {records.map((record, k) =>
                        <RecordTile record={record} removeRecord={removeRecord} showFooter={true} key={k} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default RecordManager;