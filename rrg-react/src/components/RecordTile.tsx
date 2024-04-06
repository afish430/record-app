import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { Record } from '../types/record';

import '../styles/App.scss';
import '../styles/record-tile.scss';

type RecordTileProps = {
    record: Record,
    showFooter?: boolean,
    baseUrl?: string,
    removeRecord?(id: string): void
};

const RecordTile: React.FC<RecordTileProps> = ({record, removeRecord, showFooter, baseUrl}) => {

    const onDeleteClick = (id?: string) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            axios
                .delete(baseUrl + "/records/" + id,
                {
                    headers: {
                        token: localStorage.getItem("jwt") || ""
                    }
                })
                .then(res => {
                    if (removeRecord && id) {
                        removeRecord(id);
                    }
                })
                .catch(err => {
                    console.log("An error occurred deleting a record");
                })
        }
    };

    const getShortenedTitleIfNeeded = (record: Record) => {
        let title = record.title;
        if (record.artist.length > 22 && record.title.length > 22) {
            title =  title.slice(0, 18) + "...";
        }
        return title;
    };

    return (
        <div className="record-tile-container" id={record._id}>
            {
                record.image && <img src={record.image} alt="" />
            }
            {
                !record.image && 
                <div className="no-img text-center">
                    <h4>No Image Available</h4>
                </div>
            }
            {
            record.favorite &&
                <span className="star-fav" title="This is a favorite!">
                    &#9733;
                </span>
            }
            <div className="desc">
                <h2>
                    {getShortenedTitleIfNeeded(record)}
                </h2>
                <h3>{record.artist}</h3>
                <h4>{record.genre}</h4>
                <h4>{record.year > 0 ? record.year : "Year Unknown"}</h4>
                <h4 className="more-info text-center">
                    <a target="_blank" rel="noreferrer" href={record.link}>
                        More Info
                    </a>
                </h4>
            </div>
            {!showFooter &&
                <div className="mt-3">
                    <strong className="pulsate dance">
                        &#9836; Enjoy your record! &#9836;
                    </strong>
                </div>
            }
            {showFooter && <div className="tile-footer">
                <Link to={`/edit-record/${record._id}`} className="btn btn-info btn-sm btn-block">
                    Edit Record
                </Link>
                <button 
                    type="button" 
                    className="btn btn-danger btn-sm btn-block mb-1" 
                    onClick={() => onDeleteClick(record._id)}
                >
                    Remove Record
                </button>
            </div>}
        </div>
    )
};

export default RecordTile;