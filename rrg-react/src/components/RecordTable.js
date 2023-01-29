import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import '../styles/App.scss';
import axios from 'axios';

function RecordTable(props) {

    const defaultSortInfo = {
        sortField: "artist",
        direction: "ASC"
    }
    const [recordList, setRecordList] = useState(props.records);
    const [sortInfo, setSortInfo] = useState(defaultSortInfo);

    useEffect(() => {
        setRecordList(props.records);
        setTimeout(() => {
            if(props.recordIdFromHash){
                executeScroll(props.recordIdFromHash.substring(1)); // remove # part
            }
        }, 0);
         
    }, [props.records, props.recordIdFromHash]);

    const onDeleteClick = (id) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
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
        }
    };

    const sortRecordTable = (sortField) => {
        let records= [...recordList];
        let direction = "ASC";
        if (sortInfo.sortField === sortField && sortInfo.direction === "ASC") {
           direction = "DESC";
        }
        if (direction === "ASC")
        {
            records.sort((a, b) => {
                if ( a[sortField] < b[sortField] ){
                    return -1;
                  }
                else if ( a[sortField] > b[sortField] ){
                    return 1;
                }
                return 0;
            });
        } else {
            records.sort((a, b) => {
                if ( a[sortField] > b[sortField] ){
                    return -1;
                  }
                else if ( a[sortField] < b[sortField] ){
                    return 1;
                }
                return 0;
            });
        }
        setSortInfo({sortField, direction});
        setRecordList(records);
    }

    const executeScroll = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }

  return (
    <Table striped bordered hover size="sm">
      <thead className="RecordTableHead">
        <tr>
          <th></th>
          <th
            className="sortable"
            onClick={() => sortRecordTable("artist")}>
             Artist
             {sortInfo.sortField === "artist" && sortInfo.direction === "ASC" && <i className="fa fa-caret-up"></i>}
             {sortInfo.sortField === "artist" && sortInfo.direction === "DESC" && <i className="fa fa-caret-down"></i>}
          </th>
          <th
            className="sortable"
            onClick={() => sortRecordTable("title")}>
            Album Name
            {sortInfo.sortField === "title" && sortInfo.direction === "ASC" && <i className="fa fa-caret-up"></i>}
            {sortInfo.sortField === "title" && sortInfo.direction === "DESC" && <i className="fa fa-caret-down"></i>}
          </th>
          <th
            className="sortable"
            onClick={() => sortRecordTable("year")}>
            Year
            {sortInfo.sortField === "year" && sortInfo.direction === "ASC" && <i className="fa fa-caret-up"></i>}
            {sortInfo.sortField === "year" && sortInfo.direction === "DESC" && <i className="fa fa-caret-down"></i>}
          </th>
          <th
            className="sortable"
            onClick={() => sortRecordTable("genre")}>
            Genre
            {sortInfo.sortField === "genre" && sortInfo.direction === "ASC" && <i className="fa fa-caret-up"></i>}
            {sortInfo.sortField === "genre" && sortInfo.direction === "DESC" && <i className="fa fa-caret-down"></i>}
          </th>
          <th
            className="sortable"
            onClick={() => sortRecordTable("favorite")}>
            Favorite
            {sortInfo.sortField === "favorite" && sortInfo.direction === "ASC" && <i className="fa fa-caret-up"></i>}
            {sortInfo.sortField === "favorite" && sortInfo.direction === "DESC" && <i className="fa fa-caret-down"></i>}
          </th>
          <th className="buttonColumn">Edit</th>
          <th className="buttonColumn">Delete</th>
        </tr>
      </thead>
      <tbody className="RecordTableBody">
      {
        recordList.map(( record ) => 
            <tr key={record._id} id={record._id}>
              <td className="CoverThumbnail">
                <img width="50" height="50" src={record.image} alt=""></img>
              </td>
              <td>{record.artist}</td>
              <td>{record.title}</td>
              <td>{record.year}</td>
              <td>{record.genre}</td>
              <td>{record.favorite ? 'Yes' : 'No'}</td>
              <td>
                <Link to={`/edit-record/${record._id}`} className="btn btn-info btn-sm btn-block">
                    Edit
                </Link>
              </td>
              <td>
                <button
                    type="button" 
                    className="btn btn-danger btn-sm btn-block mb-1" 
                    onClick={onDeleteClick.bind(this, record._id)}>
                    Delete
                </button>
              </td>
            </tr>
            )
        }
      </tbody>
    </Table>
  );
}

export default RecordTable;