import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { Record } from '../types/record';

import '../styles/App.scss';

type RecordTableProps = {
  records: Record[],
  removeRecord(id: string): void,
  recordIdFromHash: string,
  baseUrl: string
};

type SortInfo = {
  sortField: string,
  direction: string
}

const RecordTable: React.FC<RecordTableProps> = ({records, removeRecord, baseUrl, recordIdFromHash}) => {
    const defaultSortInfo: SortInfo = {
        sortField: "artist",
        direction: "ASC"
    };
    const [recordList, setRecordList] = useState<Record[]>(records);
    const [sortInfo, setSortInfo] = useState<SortInfo>(defaultSortInfo);

    useEffect(() => {
        setRecordList(records);
        setTimeout(() => {
            if(recordIdFromHash){
                executeScroll(recordIdFromHash.substring(1)); // remove # part
            }
        }, 0);
         
    }, [records, recordIdFromHash]);

    const onDeleteClick = (id: string) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            axios
                .delete(baseUrl + "/records/" + id,
                {
                    headers: {
                        token: localStorage.getItem("jwt") || ""
                    }
                })
                .then(res => {
                    removeRecord(id);
                })
                .catch(err => {
                    console.log("An error occurred deleting a record");
                })
        }
    };

    const sortRecordTable = (sortField: string) => {
        let records= [...recordList];
        let direction = "ASC";
        if (sortInfo.sortField === sortField && sortInfo.direction === "ASC") {
           direction = "DESC";
        }
        if (direction === "ASC")
        {
            records.sort((a, b) => {
                if ( a[sortField as keyof Record] < b[sortField as keyof Record] ){
                    return -1;
                  }
                else if ( a[sortField as keyof Record] > b[sortField as keyof Record] ){
                    return 1;
                }
                return 0;
            });
        } else {
            records.sort((a, b) => {
                if ( a[sortField as keyof Record] > b[sortField as keyof Record] ){
                    return -1;
                  }
                else if ( a[sortField as keyof Record] < b[sortField as keyof Record] ){
                    return 1;
                }
                return 0;
            });
        }
        setSortInfo({sortField, direction});
        setRecordList(records);
    }

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

  return (
    <Table striped bordered hover size="sm">
      <thead className="record-table-head">
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
          <th className="button-column">Edit</th>
          <th className="button-column">Delete</th>
        </tr>
      </thead>
      <tbody className="record-table-body">
      {
        recordList.map(record => 
            <tr key={record._id} id={record._id}>
              <td className="cover-thumbnail">
                <img width="50" height="50" src={record.image} alt=""></img>
              </td>
              <td>{record.artist}</td>
              <td>
                <a className="album-link" href={record.link} target="_blank">{record.title}</a>
              </td>
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
                    className="btn btn-danger btn-sm btn-block" 
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