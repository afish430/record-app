import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/App.scss';
import axios from 'axios';

function CreateUserPage(props) {

    const [errorMessage, setErrorMessage] = useState('');

    const handleCreateUser = e => {
        alert("Creating User!");
    };

    return (
        <div className="create-user-page">
            <div className="container mb-5">
                <div className="row">
                    <div className="col-md-8 m-auto text-center">
                        <h1 className="display-5">Create New User</h1>
                        <form className="form-inline justify-content-center">
                            <div className='form-group'>
                                <label htmlFor="userName">User Name:</label>
                                <input name="userName" type="text"></input>
                            </div>
                            <div className='form-group'>
                                <label htmlFor="password">Password:</label>
                                <input name="password" type="password"></input>
                            </div>
                        </form>
                        <br />
                        <button
                            className="btn btn-warning btn-lg m-2"
                            onClick={handleCreateUser}
                        >
                            Create User!
                        </button>
                        <div><strong className="text-danger">{errorMessage}</strong></div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <Link to="/login" className="btn btn-warning float-right">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default CreateUserPage;