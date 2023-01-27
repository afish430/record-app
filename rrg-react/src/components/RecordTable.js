import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import '../styles/App.scss';
import axios from 'axios';

function RecordTable(props) {

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

  return (
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th></th>
          <th>Artist</th>
          <th>Album Name</th>
          <th>Year</th>
          <th>Genre</th>
          <th>Favorite?</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody className="RecordTableBody">
      {
      props.records.map(( record ) => 
            <tr key={record.id}>
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