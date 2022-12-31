import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/App.scss';
import axios from 'axios';

function LoginPage(props) {

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = e => {
        e.preventDefault();
        setSuccessMessage("You have logged in");
    };

    return (
        <div className="CreateUserPage">
            <div className="container mb-5">
                <div className="row">
                    <div className="col-md-4 m-auto text-center">
                        <h1 className="display-5">Login</h1>
                        <form onSubmit={handleSubmit} className="form justify-content-center">
                            <div className='form-group'>
                                <label htmlFor="userName">User Name:</label>
                                <input
                                    required
                                    name="userName"
                                    type="text"
                                    className="form-control"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}>
                                </input>
                            </div>
                            <div className='form-group'>
                                <label htmlFor="password">Password:</label>
                                <input
                                    required
                                    name="password"
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}>
                                </input>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-warning btn-lg m-2"
                            >
                            Create User!
                        </button>
                        </form>
                        <br />
                        <div><strong className="text-danger">{errorMessage}</strong></div>
                        <div><strong className="text-success">{successMessage}</strong></div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <Link to="/create-account" className="btn btn-warning">
                            Create an Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default LoginPage;