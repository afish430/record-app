import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import axios from 'axios';

const RecordTile = (props) => {
    const record = props.record;

    const onDeleteClick = (id) => {
        axios
            .delete('http://localhost:8082/api/records/' + id)
            .then(res => {
                console.log("Deletion successful");
                props.removeRecord(id);
            })
            .catch(err => {
                console.log("Error in RecordTile_deleteClick");
                console.log(err);
            })
    };

    return (
        <div className="record-tile-container">
            <img src={record.image} alt="" />
            {!record.image && <div className="no-img text-center">No Image Available</div>}
            <div className="desc">
                <h2>
                    {record.title}
                    {record.favorite && <span className="star-fav">&#9733;</span>}
                </h2>
                <h3>{record.artist}</h3>
                <h4>{record.genre}</h4>
                <h4>{record.year}</h4>
                <h4><a target="_blank" rel="noreferrer" href={record.link}>More Info</a></h4>
            </div>
            {!props.showFooter &&
                <div><strong>&#9836; ENJOY!! &#9836;</strong></div>
            }
            {props.showFooter && <div className="tile-footer">
                <Link to={`/edit-record/${record._id}`} className="btn btn-info btn-sm btn-block">
                    Edit Record
                </Link>
                <button type="button" className="btn btn-danger btn-sm btn-block" onClick={onDeleteClick.bind(this, record._id)}>Remove Record</button>
            </div>}
        </div>
    )
};

export default RecordTile;