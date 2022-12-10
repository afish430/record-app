import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../styles/App.scss';
import axios from 'axios';

class AddRecord extends Component {
    constructor() {
        super();
        this.state = {
            title: '',
            artist: '',
            genre: 'Classic Rock',
            year: '',
            link: '',
            image: '',
            favorite: false,
            errorMessage: ''
        };
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onSubmit = e => {
        e.preventDefault();

        if (!this.state.title || !this.state.artist) {
            this.setState({ errorMessage: 'Album and Artist names are required.' });
            return;
        }

        const data = {
            title: this.state.title,
            artist: this.state.artist,
            genre: this.state.genre,
            year: this.state.year,
            link: this.state.link,
            image: this.state.image,
            favorite: this.state.favorite
        };

        axios
            .post('http://localhost:8082/api/records', data)
            .then(res => {
                this.setState({
                    title: '',
                    artist: '',
                    genre: '',
                    year: '',
                    link: '',
                    image: '',
                    favorite: '',
                    errorMessage: ''
                })
                this.props.history.push('/manage-records#' + res.data._id);
            })
            .catch(err => {
                console.log("Error in AddRecord!");
            })
    };

    render() {
        return (
            <div className="AddRecord">
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
                                    <select
                                        className="form-control"
                                        id="genre"
                                        name="genre"
                                        value={this.state.genre}
                                        onChange={this.onChange}
                                    >
                                        <option value="Classic Rock">Classic Rock</option>
                                        <option value="Rock">Rock</option>
                                        <option value="Folk">Folk</option>
                                        <option value="Country">Country</option>
                                        <option value="Pop">Pop</option>
                                        <option value="Soul">Soul</option>
                                        <option value="Reggae">Reggae</option>
                                        <option value="Holiday">Holiday</option>
                                        <option value="Childrens">Children's</option>
                                        <option value="Other">Other</option>
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

                                <Link to="/manage-records" className="btn btn-light float-left">
                                    Cancel
                                </Link>
                                <button type="submit" className="btn btn-info mb-2 float-right">Add Record</button>
                                <strong className="text-danger">{this.state.errorMessage}</strong>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddRecord;
