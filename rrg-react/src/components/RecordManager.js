import React, { useState, useEffect, useRef } from 'react';
import '../styles/App.scss';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import RecordTile from './RecordTile';

function RecordManager() {
    const [records, setRecords] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('AllButSpecialty');
    const [filteredRecords, setFilteredRecords] = useState([]);
    const recordIdFromHash = useLocation().hash;
    const searchInputRef = useRef(null);

    // fetch and sort all records on page load
    useEffect(() => {
        axios
            .get('http://localhost:8082/api/records')
            .then(res => {
                let sortedRecords = res.data.sort(sortByArtist);
                setRecords(sortedRecords);
                setFilteredRecords(sortedRecords.filter(r => r.genre !== 'Holiday' && r.genre !== 'Childrens'));
                if(recordIdFromHash){
                    executeScroll(recordIdFromHash.substring(1)); // remove # part
                }
            })
            .catch(err => {
                console.log('Error from RecordManager');
                console.log(err);
            })
    }, [recordIdFromHash]);

    // update filtered records on filter change
    useEffect(() => {
        if (selectedGenre === 'AllButSpecialty') {
            setFilteredRecords(records.filter(rec => rec.genre !== 'Holiday' && rec.genre !== 'Childrens'));
        }
        else if (selectedGenre === 'Any') {
            setFilteredRecords(records.map(rec => rec));
        }
        else if (selectedGenre === '60s') {
            console.log('is 60s');
            setFilteredRecords(records.filter(rec => rec.year >= 1960 && rec.year < 1970));
        }
        else if (selectedGenre === '70s') {
            console.log('is 70s');
            setFilteredRecords(records.filter(rec => rec.year >= 1970 && rec.year < 1980));
        }
        else if (selectedGenre === '80s') {
            setFilteredRecords(records.filter(rec => rec.year >= 1980 && rec.year < 1990));
        }
        else if (selectedGenre === '90s') {
            setFilteredRecords(records.filter(rec => rec.year >= 1990));
        }
        else if (selectedGenre === 'Favorites') {
            setFilteredRecords(records.filter(rec => rec.favorite === true));
        }
        else {
            setFilteredRecords(records.filter(rec => rec.genre === selectedGenre));
        } 
    }, [selectedGenre, records]);

    const executeScroll = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }

    const removeRecord = (id) => {
        setRecords(records.filter(rec => rec._id !== id));
        setFilteredRecords(filteredRecords.filter(rec => rec._id !== id));
    }

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            searchRecords();
            e.preventDefault();
        }
    }

    const handleSearchClick = (e) => {
        e.preventDefault();
        searchRecords();
    }

    const searchRecords = () => {
        setSelectedGenre('Any');
        setTimeout(() => {
            const searchTerm = searchInputRef.current.value.toLowerCase();
            setFilteredRecords(records.filter(
                rec => rec.artist.toLowerCase().indexOf(searchTerm) !== -1 || rec.title.toLowerCase().indexOf(searchTerm) !== -1)
            );
        }, 100);
    }

    const clearSearch = (e) => {
        e.preventDefault();
        setSelectedGenre('AllButSpecialty');
        setFilteredRecords(records);
        searchInputRef.current.value = "";
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

    const onFilterChange = e => {
        searchInputRef.current.value = "";
        setSelectedGenre(e.target.value); // see useEffect() for actual changes
    };

    return (
        <div className="RecordManager">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h1 className="display-5 text-center">Manage Records</h1>
                    </div>
                    <div className="col-md-4">
                        <form className="form justify-content-left">
                            <div className='form-group'>
                                <label htmlFor="favorite">Filter:</label>
                                <select
                                    className="form-control ml-2"
                                    name="genre"
                                    value={selectedGenre}
                                    onChange={onFilterChange}
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
                                    <option value="60s">60s</option>
                                    <option value="70s">70s</option>
                                    <option value="80s">80s</option>
                                    <option value="90s">90s to Present</option>
                                    <option value="Favorites">Favorites</option>
                                </select>
                            </div>
                        </form>
                    </div>

                    <div className="col-md-4 text-center">
                        <form className="form-inline justify-content-center">
                            <div className="input-group">
                                <input type="search" id="searchInput" className="form-control searchInput" ref={searchInputRef} onKeyDown={handleSearchKeyDown} placeholder="search by artist or album"/>
                                <div className="input-group-append">
                                    <div className="input-group-text clearBtn">
                                        {
                                        ((searchInputRef.current && searchInputRef.current.value) || selectedGenre !== "AllButSpecialty")
                                        && <i className="fa fa-times" onClick={clearSearch}></i>
                                        }
                                    </div>
                                    <button className="btn btn-warning" type="button" onClick={handleSearchClick}>
                                        <i className="fa fa-search"></i>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="col-md-4">
                        <Link to="/add-record" className="btn btn-warning float-right">
                            + Add New Record
                        </Link>
                        <br />
                    </div>

                </div>

                <div className="text-center">
                    <label className="recordCount">
                        (Showing {filteredRecords.length} Records)
                    </label>
                </div>

                <div className="list">
                    {filteredRecords.map((record, i) =>
                        <RecordTile
                            record={record}
                            removeRecord={removeRecord}
                            showFooter={true}
                            key={i}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default RecordManager;