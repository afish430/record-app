import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/App.scss';
import axios from 'axios';

function CreateUserPage(props) {

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const handleSubmit = e => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        let newUser = {
            userName,
            email,
            password,
            password2
        };
        axios
            .post('http://localhost:8082/api/auth/signup', newUser)
            .then(res => {
                setSuccessMessage(`The user ${res.data.result.userName} has been created!`);
                setUserName("");
                setEmail("");
                setPassword("");
                setPassword2("");
            })
            .catch(err => {
                setErrorMessage("The user could not be created");
            })
    };

    return (
        <div className="CreateUserPage">
            <div className="container mb-5">
                <div className="row">
                    <div className="col-md-4 m-auto text-center">
                        <h1 className="display-5">Create New User</h1>
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
                                <label htmlFor="password2">Email:</label>
                                <input
                                    required
                                    name="email"
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}>
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
                            <div className='form-group'>
                                <label htmlFor="password2">Password:</label>
                                <input
                                    required
                                    name="password2"
                                    type="password"
                                    className="form-control"
                                    value={password2}
                                    onChange={(e) => setPassword2(e.target.value)}>
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
                        <Link to="/login" className="btn btn-warning">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateUserPage;