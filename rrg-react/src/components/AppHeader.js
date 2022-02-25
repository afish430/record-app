import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../styles/App.scss';
import turntable from './../images/turntable.png';

class AppHeader extends Component {
    constructor() {
        super();
        this.state = {
            activeRoute: window.location.pathname === "/" ? "Generate" : "Manage"
        };
    }

    setGenerateActive = () => {
        this.setState({ activeRoute: 'Generate' });
    }

    setManageActive = () => {
        this.setState({ activeRoute: 'Manage' });
    }

    render() {
        return (
            <div className="AppHeader text-center">
                <div className="container">
                    <h1>The Vinylator<img src={turntable} alt="recordplayer"></img></h1>
                    <div className="row">
                        <Link to="/" className={"btn float-left mr-2 " + (this.state.activeRoute === "Generate" ? "btn-info" : "btn-light")} onClick={this.setGenerateActive}>
                            Generate a Record!
                        </Link>
                        <Link to="/manage-records" className={"btn float-left " + (this.state.activeRoute === "Manage" ? "btn-info" : "btn-outline-light")} onClick={this.setManageActive}>
                            Manage Records
                        </Link>
                    </div>
                </div>
                <hr></hr>
            </div>
        );
    }
}

export default AppHeader;
