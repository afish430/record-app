import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/App.scss';
import turntable from './../images/turntable.png';

function AppHeader() {
    let currentRoute = window.location.pathname === "/" ? "Generate" : "Manage";
    const [activeRoute, setActiveRoute] = useState(currentRoute);

    const setGenerateActive = () => {
        setActiveRoute('Generate');
    }

    const setManageActive = () => {
        setActiveRoute('Manage');
    }
  
    return (
        <div className="AppHeader text-center">
            <div className="container">
                <h1>The Vinylator<img src={turntable} alt="recordplayer"></img></h1>
                <div className="row">
                    <Link to="/" className={"btn mr-2 " + (activeRoute === "Generate" ? "btn-info" : "btn-outline-light")} onClick={setGenerateActive}>
                        Record Generator
                    </Link>
                    <Link to="/manage-records" className={"btn ml-2 " + (activeRoute === "Manage" ? "btn-info" : "btn-outline-light")} onClick={setManageActive}>
                        Record Manager
                    </Link>
                </div>
            </div>
            <hr></hr>
        </div>
    );
  };

export default AppHeader;
