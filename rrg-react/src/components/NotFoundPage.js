import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/App.scss';
import '../styles/skipping-record.css';

function NotFoundPage(props) {
    return (
        <div className="NotFoundPage">
            <div className="container mb-5">
                <div className="row">
                    <div className="col-md-4 m-auto text-center">
                        <h1 className="display-5">Page Not Found</h1>
                        <Link to="/" className="btn btn-warning">
                            Back to Home
                        </Link>
                    </div>
                </div>
                <div className="text-center mt-4">
                        <svg viewBox="0 0 400 400">
                            <defs>
                            <linearGradient id="skippingRecordGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0" className="start-color"/>
                                <stop offset="1" className="end-color"/>
                            </linearGradient>
                            </defs>
                            <g id="record">
                                <circle className="line" r="200" cx="200" cy="200" />
                                <circle r="198" cx="200" cy="200" />
                                <circle className="line" r="180" cx="200" cy="200" />
                                <circle className="line" r="160" cx="200" cy="200" />
                                <circle className="line" r="140" cx="200" cy="200" />
                                <circle id="label" cx="200" cy="200" r="65" />
                                <text y="180" x="165">Something</text>
                                <text y="230" x="155">Went Wrong</text>
                                <circle id="dot" cx="200" cy="200" r="6" />
                            </g>
                        </svg>
                    </div>
            </div>
        </div>

    )
}

export default NotFoundPage;