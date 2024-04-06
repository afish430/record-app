import { FormEventHandler, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios, {AxiosResponse} from 'axios';

import { User } from '../types/user';

import '../styles/App.scss';

type LoginPageProps = {
    baseUrl: string,
    setUser(user: User): void,
    setViewMode(mode: string): void
};

const LoginPage: React.FC<LoginPageProps> = (props) => {

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const history = useHistory();

    const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault();
        setErrorMessage("");
        let user = {
            userName,
            password
        };
        
        axios
            .post(props.baseUrl + "/auth/login", user)
            .then((res: AxiosResponse<any>) => {
                setUserName("");
                setPassword("");
                props.setUser(res.data.result);
                props.setViewMode("Tile");
                localStorage.setItem("jwt", res.data.token);
                history.push("/");
            })
            .catch(err => {
                if (err && err.response && err.response.data) {
                    setErrorMessage(err.response.data.error);
                } else {
                    setErrorMessage("An error occurred");
                }
            })
    };

    return (
        <div className="login-page">
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
                            Login!
                        </button>
                        </form>
                        <br />
                        <div><strong className="text-danger">{errorMessage}</strong></div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4 text-center m-auto">
                        <div>Or</div>
                        <Link to="/create-account" className="btn-link login-link">
                            Create an Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default LoginPage;