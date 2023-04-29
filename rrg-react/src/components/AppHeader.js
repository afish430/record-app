import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '../styles/App.scss';
import '../styles/app-header.scss';
import turntable from './../images/turntable.png';

function AppHeader(props) {
    let currentRoute;
    if (window.location.pathname === "/Generate") {
        currentRoute = "Generate";
    }
    else if (window.location.pathname === "/Stats") {
        currentRoute = "Stats";
    }
    else {
        currentRoute = "Manage";
    }

    const [activeRoute, setActiveRoute] = useState(currentRoute);
    const history = useHistory();

    const setManageActive = () => {
        setActiveRoute('Manage');
    }

    const setGenerateActive = () => {
        setActiveRoute('Generate');
    }

    const setStatsActive = () => {
        setActiveRoute('Stats');
    }

    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);
    
    const logout = () => {
        localStorage.setItem("jwt", null);
        props.setCurrentUser({});
        setActiveRoute('Manage');
        history.push('/login');
    }
  
    return (
        <div className="app-header text-center">
            <div className="container">
                { props.user.userName && 
                    <>
                        <span className="logout">
                            <Button variant="danger" onClick={logout}>Logout</Button>
                        <span className="user-name">  [{props.user.userName}]</span>
                        </span>
                    </>
                }
                <Button variant="info" className="about-btn" onClick={handleShowModal}>
                    About
                </Button>
                <h1>The Vinylator<img src={turntable} alt="recordplayer"></img></h1>
                { props.user.userName && 
                <>
                <div className="row">
                    <Link to="/" className={"btn btn-tab " + (activeRoute === "Manage" ? "btn-info" : "btn-outline-light")} onClick={setManageActive}>
                        Record Manager
                    </Link>
                    <Link to="/Stats" className={"btn btn-tab ml-2 " + (activeRoute === "Stats" ? "btn-info" : "btn-outline-light")} onClick={setStatsActive}>
                        Record Stats
                    </Link>
                    <Link to="/Generate" className={"btn btn-tab ml-2 " + (activeRoute === "Generate" ? "btn-info" : "btn-outline-light")} onClick={setGenerateActive}>
                        Record Generator
                    </Link>
                </div>
                </>}
            </div>
            <hr></hr>

            <Modal show={showModal} onHide={handleClose} centered size="lg">
                <Modal.Header>
                    <Modal.Title className="m-auto">
                        About The Vinylator
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    The Vinylator is your own personal record collection manager and listening helper.
                    Add, edit and delete records to manage your vinyl collection.
                    You can easily search and filter your collection, and even mark certain records as favorites.
                    The Vinylator will also compile statistics and charts summarizing your musical tastes.
                    When you just aren't sure what to listen to, the <em>Random Record Generator</em> feature is your best friend.
                    Just hit the "Generate Record" button and let the music come to you. Happy listening!
                    <div className="modal-screenshots">
                        <img src="recordStats.png"></img>
                        <img src="recordManager.png"></img>
                        <img src="recordGenerator.png"></img>
                    </div>
                </Modal.Body>
                <Modal.Footer className="text-center">
                    <Button variant="info" onClick={handleClose} className="m-auto">
                        Rock On!
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
  };

export default AppHeader;
