import { useState, useEffect, useRef, ChangeEventHandler, MouseEventHandler, KeyboardEventHandler } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import axios, {AxiosResponse} from 'axios';

import RecordTile from './RecordTile';
import RecordTable from './RecordTable';
import { Record } from '../types/record';
import { User } from '../types/user';

import '../styles/App.scss';
import '../styles/record-manager.scss';

type RecordManagerProps = {
    baseUrl: string,
    mode: string,
    user: User,
    genres: string[],
    setCurrentUser(user: User): void,
    setViewMode(mode: string): void,
    hasGenre(genre: string, records: Record[]): boolean,
    checkLogin(): void
  };

const RecordManager: React.FC<RecordManagerProps> = (props) => {

    const [records, setRecords] = useState<Record[]>([]);
    const [recordsLoaded, setRecordsLoaded] = useState<boolean>(false);
    const [selectedGenre, setSelectedGenre] = useState<string>('Any');
    const [filteredRecords, setFilteredRecords] = useState<Record[]>([]);
    const recordIdFromHash = useLocation().hash;
    const [hashId, setHashId] = useState(recordIdFromHash);
    const searchInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        props.checkLogin();

        if(!props.mode) {
            props.setViewMode("Tile");
        }

        // fetch and sort all records on page load:
        axios.get(props.baseUrl + "/records",
                {
                    headers: {
                        token: localStorage.getItem("jwt") || ""
                    }
                })
            .then((res: AxiosResponse<Record[]>) => {
                let sortedRecords: Record[] = res.data.sort(sortByArtist);
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

    // update filtered records on filter change:
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

    const executeScroll = (id: string) => {
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

    const removeRecord = (id: string) => {
        const element = document.getElementById(id);
        element?.classList.add('hide-before-delete');
            setTimeout(() => {
                element?.classList.remove('hide-before-delete');
                setRecords(records.filter(rec => rec._id !== id));
                setFilteredRecords(filteredRecords.filter(rec => rec._id !== id));
            }, 1500);
    }

    const handleSearchKeyDown: KeyboardEventHandler = (e) => {
        if (e.key === 'Enter') {
            searchRecords();
            e.preventDefault();
        }
    }

    const handleSearchClick: MouseEventHandler = (e) => {
        e.preventDefault();
        searchRecords();
    }

    const searchRecords = (): void => {
        setSelectedGenre('Any');
        setTimeout(() => {
            const searchTerm: string | undefined = searchInputRef.current?.value.toLowerCase();
            if (searchTerm) {
                setFilteredRecords(records.filter(
                    rec => rec.artist.toLowerCase().indexOf(searchTerm) !== -1 || rec.title.toLowerCase().indexOf(searchTerm) !== -1)
                );
            }
        }, 100);
    }

    const clearSearch: MouseEventHandler = (e) => {
        e.preventDefault();
        setHashId("");
        setSelectedGenre('Any');
        setFilteredRecords(records);
        if (searchInputRef.current) {
            searchInputRef.current.value = "";
        }
    }

    const sortByArtist = (a: Record, b: Record): number => {
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

    const onFilterChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
        setHashId("");
        if (searchInputRef.current) {
            searchInputRef.current.value = "";
        }
        setSelectedGenre(e.currentTarget.value); // see useEffect() for actual changes
    };

    const toggleMode = (): void => {
        setHashId("");
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
                                        <div className="input-group-text clear-btn">
                                            {
                                                ((searchInputRef.current && searchInputRef.current.value) || selectedGenre !== "Any")
                                                && 
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={
                                                        <Tooltip className="info-tooltip">
                                                            Clear Search or Filter
                                                        </Tooltip>
                                                    }
                                                    >
                                                    <i className="fa fa-times" onClick={clearSearch}></i>
                                                </OverlayTrigger>
                                            }
                                        </div>
                                        <button className="btn btn-warning" type="button" onClick={handleSearchClick}>
                                        <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip className="info-tooltip">
                                                        Search by Artist or Album
                                                    </Tooltip>
                                                }
                                                >
                                                <i className="fa fa-search"></i>
                                            </OverlayTrigger>
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
                            <RecordTable records={filteredRecords} removeRecord={removeRecord} recordIdFromHash={hashId} baseUrl={props.baseUrl} />
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