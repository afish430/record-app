import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/App.scss';

class EditRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            artist: '',
            genre: '',
            year: '',
            link: '',
            image: '',
            favorite: '',
            userId: '',
            errorMessage: ''
        };
    }

    componentDidMount() {
        axios
            .get('http://localhost:8082/api/records/' + this.props.match.params.id)
            .then(res => {
                this.setState({
                    title: res.data.title,
                    artist: res.data.artist,
                    genre: res.data.genre,
                    year: res.data.year,
                    link: res.data.link,
                    image: res.data.image,
                    favorite: res.data.favorite,
                    userId: res.data.userId
                })
            })
            .catch(err => {
                console.log("Error in EditRecord");
            })
    };

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
            userId: this.state.userId
        };

        axios
            .put('http://localhost:8082/api/records/' + this.props.match.params.id, data)
            .then(res => {
                this.props.history.push('/#' + this.props.match.params.id);
            })
            .catch(err => {
                this.setState({ errorMessage: 'An error occurred.'});
                console.log(err);
            })
    };


    render() {
        return (
            <div className="EditRecord">
                <div className="container mb-5">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="text-center">Edit Record</h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 m-auto">
                            <form onSubmit={this.onSubmit}>
                                <div className='form-group'>
                                    <label htmlFor="title">Album Title</label>
                                    <input
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

                                <Link to={"/#" + this.props.match.params.id} className="btn btn-light float-left">
                                Cancel
                                </Link>
                                <button type="submit" className="btn btn-info mb-2 float-right">Update Record</button>
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

export default EditRecord;