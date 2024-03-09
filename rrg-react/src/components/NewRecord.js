import { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import '../styles/App.scss';
import infoIcon from './../images/info-icon.png';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import axios from 'axios';

class NewRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            artist: '',
            genre: 'Classic Rock',
            year: '',
            link: '',
            image: '',
            favorite: false,
            userId: '',
            errorMessage: ''
        };

        // make sure user is logged in
        if (!props.user || !props.user._id) {
            this.props.history.push('/login');
        }
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onSubmit = e => {
        e.preventDefault();

        if (!this.state.title || !this.state.artist) {
            this.setState({ errorMessage: 'Album and Artist names are required.'});
            return;
        }

        const data = {
            title: this.state.title,
            artist: this.state.artist,
            genre: this.state.genre,
            year: this.state.year,
            link: this.state.link,
            image: this.state.image,
            favorite: this.state.favorite,
            userId: this.props.user._id
        };

        axios
            .post(this.props.baseUrl + '/records', data,
                {
                    headers: {
                        token: localStorage.getItem("jwt")
                    }
                })
            .then(res => {
                this.setState({
                    title: '',
                    artist: '',
                    genre: '',
                    year: '',
                    link: '',
                    image: '',
                    favorite: '',
                    userId: '',
                    errorMessage: ''
                })
                this.props.history.push('/#' + res.data._id);
            })
            .catch(err => {
                this.setState({ errorMessage: 'An Error Occurred.'});
                // console.log(err);
            })
    };

    render() {
        return (
            <div className="add-record">
                <div className="container mb-5">
                    <div className="row">
                        <div className="col-md-6 m-auto">
                            <h1 className="text-center">Add a Record</h1>
                            <form onSubmit={this.onSubmit}>
                                <div className='form-group'>
                                    <label htmlFor="title">Album Title</label>
                                    <input
                                        required
                                        type='text'
                                        name='title'
                                        className='form-control'
                                        value={this.state.title}
                                        onChange={this.onChange}
                                    />
                                </div>

                                <div className='form-group'>
                                    <label htmlFor="artist">Band or Artist Name</label>
                                    <input
                                        required
                                        type='text'
                                        name='artist'
                                        className='form-control'
                                        value={this.state.artist}
                                        onChange={this.onChange}
                                    />
                                </div>

                                <div className='form-group'>
                                    <label htmlFor="favorite">Genre</label>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip wrapperClassName="info-tooltip">
                                                {this.props.tooltipText.genre}
                                            </Tooltip>
                                        }
                                        >
                                        <img className="info-icon" src={infoIcon}></img>
                                    </OverlayTrigger>
                                    <select
                                        className="form-control"
                                        id="genre"
                                        name="genre"
                                        value={this.state.genre}
                                        onChange={this.onChange}
                                    >
                                        {
                                            this.props.genres.map(genre => {
                                                return <option key={genre} value={genre}>{genre}</option>
                                            })
                                        }
                                    </select>
                                </div>

                                <div className='form-group'>
                                    <label htmlFor="year">Year Released</label>
                                    <input
                                        type='number'
                                        name='year'
                                        className='form-control'
                                        value={this.state.year}
                                        onChange={this.onChange}
                                    />
                                </div>

                                <div className='form-group'>
                                    <label htmlFor="link">URL for More Info</label>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip wrapperClassName="info-tooltip">
                                                {this.props.tooltipText.link}
                                            </Tooltip>
                                        }
                                        >
                                        <img className="info-icon" src={infoIcon}></img>
                                    </OverlayTrigger>
                                    <input
                                        type='text'
                                        placeholder='ex. Wikipedia'
                                        name='link'
                                        className='form-control'
                                        value={this.state.link}
                                        onChange={this.onChange}
                                    />
                                </div>

                                <div className='form-group'>
                                    <label htmlFor="image">Image URL</label>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip wrapperClassName="info-tooltip">
                                                {this.props.tooltipText.image}
                                            </Tooltip>
                                        }
                                        >
                                        <img className="info-icon" src={infoIcon}></img>
                                    </OverlayTrigger>
                                    <input
                                        type='text'
                                        name='image'
                                        className='form-control'
                                        value={this.state.image}
                                        onChange={this.onChange}
                                    />
                                </div>

                                <div className='form-group'>
                                    <label htmlFor="favorite">Is this a Favorite?</label>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip wrapperClassName="info-tooltip">
                                                {this.props.tooltipText.favorite}
                                            </Tooltip>
                                        }
                                        >
                                        <img className="info-icon" src={infoIcon}></img>
                                    </OverlayTrigger>
                                    <select
                                        className="form-control"
                                        id="favorite"
                                        name="favorite"
                                        value={this.state.favorite}
                                        onChange={this.onChange}
                                    >
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </select>
                                </div>

                                <Link to="/" className="btn btn-light float-left">
                                    Cancel
                                </Link>
                                <button type="submit" className="btn btn-info mb-2 float-right">Add Record</button>
                            </form>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 m-auto text-center">
                            <strong className="text-danger">{this.state.errorMessage}</strong>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(NewRecord);
