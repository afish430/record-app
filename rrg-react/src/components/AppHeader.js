import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
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

    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
  
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
                <Button variant="light" className="aboutBtn" onClick={handleShow}>
                    About
                </Button>
            </div>
            <hr></hr>

            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header>
                    <Modal.Title className="m-auto">
                        The Vinylator
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    The Vinylator is your own personal record collection manager and random record generator.
                    Add, edit and delete records to manage your vinyl collection.
                    You can also easily search and filter your collection, and even mark certain records as favorites.
                    When you just aren't sure what to listen to, the Random Record Generator feature is your best friend.
                    Just hit the "Generate" button and let the music come to you. Happy listening!
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
