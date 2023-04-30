import React, { useState, useEffect, useRef } from 'react';
import '../styles/App.scss';
import '../styles/record-manager.scss';
import axios from 'axios';
import { Link, useLocation, useHistory } from 'react-router-dom';
import RecordTile from './RecordTile';
import RecordTable from './RecordTable';

function RecordManager(props) {
    const [records, setRecords] = useState([]);
    const [recordsLoaded, setRecordsLoaded] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState('Any');
    const [filteredRecords, setFilteredRecords] = useState([]);
    const recordIdFromHash = useLocation().hash;
    const [hashId, setHashId] = useState(recordIdFromHash);
    const searchInputRef = useRef(null);
    const history = useHistory();

    useEffect(() => {
        // make sure user is logged in
        axios.get(props.baseUrl + "/auth/loggedInUser",
                {
                    headers: {
                        token: localStorage.getItem("jwt")
                    }
                })
            .then(res => {
                if (!res.data.user && (!props.user || !props.user._id)) {
                    history.push("/login");
                } else {
                    if (res.data.newToken) {
                        console.log("updating local storage");
                        localStorage.setItem("jwt", res.data.newToken);
                    }
                    props.setCurrentUser(res.data.user)
                }
            })
            .catch(err => {
                history.push("/login");
            })

        if(!props.mode) {
            props.setViewMode("Tile");
        }

        // fetch and sort all records on page load
        axios
            .get(props.baseUrl + "/records",
                {
                    headers: {
                        token: localStorage.getItem("jwt")
                    }
                })
            .then(res => {
                let sortedRecords = res.data.sort(sortByArtist);
                setRecords([...sortedRecords]);
                setFilteredRecords(sortedRecords);
                setRecordsLoaded(true);
                if(hashId){
                    executeScroll(hashId.substring(1)); // remove # part
                }
            })
            .catch(err => {
                console.log('Error fetching records from RecordManager');
            })
    }, []);

    // update filtered records on filter change
    useEffect(() => {
        if (selectedGenre === 'Any') {
            setFilteredRecords(records.map(rec => rec));
        }
        else if (selectedGenre === 'Pre-1960') {
            setFilteredRecords(records.filter(rec => rec.year < 1960));
        }
        else if (selectedGenre === '1960s') {
            setFilteredRecords(records.filter(rec => rec.year >= 1960 && rec.year < 1970));
        }
        else if (selectedGenre === '1970s') {
            setFilteredRecords(records.filter(rec => rec.year >= 1970 && rec.year < 1980));
        }
        else if (selectedGenre === '1980s') {
            setFilteredRecords(records.filter(rec => rec.year >= 1980 && rec.year < 1990));
        }
        else if (selectedGenre === '1990s') {
            setFilteredRecords(records.filter(rec => rec.year >= 1990 && rec.year < 2000));
        }
        else if (selectedGenre === '2000 to Present') {
            setFilteredRecords(records.filter(rec => rec.year >= 2000));
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
            element.classList.add('select-after-scroll');
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            setTimeout(() => {
                element.classList.remove('select-after-scroll');
            }, 1000);
        }
    }

    const scrollToTop = () =>{
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    const removeRecord = (id) => {
        const element = document.getElementById(id)
        element.classList.add('hide-before-delete');
            setTimeout(() => {
                element.classList.remove('hide-before-delete');
                setRecords(records.filter(rec => rec._id !== id));
                setFilteredRecords(filteredRecords.filter(rec => rec._id !== id));
            }, 1500);
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
        setSelectedGenre('Any');
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
        setHashId(null);
        searchInputRef.current.value = "";
        setSelectedGenre(e.target.value); // see useEffect() for actual changes
    };

    const toggleMode = () => {
        setHashId(null);
        if(props.mode === "Table") {
           props.setViewMode("Tile");
        }
        else if (props.mode === "Tile") {
            props.setViewMode("Table");
        }
    }

    return (
        <div className="record-manager">
            { !props.user._id &&
            <>
                <div className="text-center loading-records">
                    Loading...
                </div>
                <div className="text-center m-auto">
                    <Link to="/login" className="btn-link login-link">
                        Go to Login
                    </Link>
                </div>
            </>}
            { props.user._id &&
            <div className="container">
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <h1 className="display-5 text-center">Manage Records</h1>
                            {!recordsLoaded &&
                            <div className="text-center loading-records">
                                Loading Records...
                            </div>}
                            {recordsLoaded &&
                            <button className="btn btn-link" onClick={toggleMode}>
                                Switch to {props.mode === "Table" ? "Tile" : "Table"} Mode
                            </button>}
                        </div>
                    </div>
                {recordsLoaded && 
                <>
                    <div className="row manage-forms">
                        <div className="col-md-3 col-sm-12">
                            <form className="form-inline justify-content-center">
                                <div className="form-group">
                                    <label className="mr-2 filter-label">Filter:</label>
                                    <select
                                        className="form-control"
                                        name="genre"
                                        value={selectedGenre}
                                        onChange={onFilterChange}
                                    >
                                        <option value="Any">Any</option>
                                        {
                                            props.genres.map(genre => {
                                                return props.hasGenre(genre, records) && <option key={genre} value={genre}>{genre}</option>
                                            })
                                        }
                                        {props.hasGenre("Pre-1960", records) && <option value="Pre-1960">Pre-1960</option>}
                                        {props.hasGenre("1960s", records) && <option value="1960s">1960s</option>}
                                        {props.hasGenre("1970s", records) && <option value="1970s">1970s</option>}
                                        {props.hasGenre("1980s", records) && <option value="1980s">1980s</option>}
                                        {props.hasGenre("1990s", records) && <option value="1990s">1990s</option>}
                                        {props.hasGenre("2000 to Present", records) && <option value="2000 to Present">2000 to Present</option>}
                                        {props.hasGenre("Favorites", records) && <option value="Favorites">Favorites</option>}
                                    </select>
                                </div>
                            </form>
                        </div>

                        <div className="col-md-6 col-sm-12 text-center">
                            <form className="form-inline justify-content-center">
                                <div className="input-group">
                                    <input type="search" id="searchInput" className="form-control searchInput" ref={searchInputRef} onKeyDown={handleSearchKeyDown} placeholder="search by artist or album"/>
                                    <div className="input-group-append">
                                        <div className="input-group-text clear-btn" title="Clear Search or Filter">
                                            {
                                            ((searchInputRef.current && searchInputRef.current.value) || selectedGenre !== "Any")
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

                        <div className="col-md-3 col-sm-12 text-center">
                            <Link to="/add-record" className="btn btn-warning">
                                + Add New Record
                            </Link>
                        </div>

                    </div>

                    <div className="text-center">
                        <label className="record-count">
                            (Showing {filteredRecords.length} Records)
                        </label>
                    </div>

                    <div>
                        {
                            props.mode === "Table" &&
                            <RecordTable
                                records={filteredRecords}
                                removeRecord={removeRecord}
                                recordIdFromHash={hashId}
                                baseUrl={props.baseUrl}>
                            </RecordTable>
                        }
                    </div>

                    <div className="list">
                        {
                            props.mode === "Tile" && filteredRecords.map((record, i) =>
                                <RecordTile
                                    record={record}
                                    removeRecord={removeRecord}
                                    showFooter={true}
                                    key={i}
                                    baseUrl={props.baseUrl}
                                />
                            )
                        }
                    </div>
                </>}
            </div> }
            <button className="btn btn-link to-top" onClick={scrollToTop}>
                Top <i className="fa fa-caret-up"></i>
            </button>
        </div>
    );
}

export default RecordManager;