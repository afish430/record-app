import { FormEventHandler, useState } from 'react';
import { Link } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';

import '../styles/App.scss';

type CreateUserPageProps = {
    baseUrl: string
}

const CreateUserPage: React.FC<CreateUserPageProps> = ({baseUrl}) => {

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [userName, setUserName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [password2, setPassword2] = useState<string>("");

    const handleSubmit: FormEventHandler = e => {
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
            .post(baseUrl + "/auth/signup", newUser)
            .then((res: AxiosResponse<any>) => {
                setSuccessMessage(`The user ${res.data.result.userName} has been created!`);
                setUserName("");
                setEmail("");
                setPassword("");
                setPassword2("");
            })
            .catch(err => {
                setErrorMessage(err.response.data.error);
            })
    };

    return (
        <div className="create-user-page">
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
                                <label htmlFor="password2">Email: (Optional)</label>
                                <input
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
                                <label htmlFor="password2">Confirm Password:</label>
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
                    <div className="col-md-4 text-center m-auto">
                        <Link to="/login" className="btn-link login-link">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateUserPage;