import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

class EditRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            artist: '',
            genre: '',
            year: 0,
            link: '',
            image: '',
            favorite: false
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
                    favorite: res.data.favorite
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
            .put('http://localhost:8082/api/records/' + this.props.match.params.id, data)
            .then(res => {
                this.props.history.push('/manage-records/' + this.props.match.params.id);
            })
            .catch(err => {
                console.log("Error in EditRecord");
                console.log(err);
            })
    };


    render() {
        return (
            <div className="EditRecord">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <Link to="/manage-records" className="btn btn-warning float-left">
                                &#8592; Back to Records List
                            </Link>
                        </div>
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Edit Record</h1>
                        </div>
                    </div>

                    <div className="col-md-8 m-auto">
                        <form noValidate onSubmit={this.onSubmit}>
                            <div className='form-group'>
                                <label htmlFor="title">Title</label>
                                <input
                                    type='text'
                                    placeholder='Album Title'
                                    name='title'
                                    className='form-control'
                                    value={this.state.title}
                                    onChange={this.onChange}
                                />
                            </div>
                            <br />

                            <div className='form-group'>
                                <label htmlFor="artist">Artist</label>
                                <input
                                    type='text'
                                    placeholder='Band or Artist'
                                    name='artist'
                                    className='form-control'
                                    value={this.state.artist}
                                    onChange={this.onChange}
                                />
                            </div>

                            <div className='form-group'>
                                <label htmlFor="author">Genre</label>
                                <input
                                    type='text'
                                    placeholder='Genre'
                                    name='genre'
                                    className='form-control'
                                    value={this.state.genre}
                                    onChange={this.onChange}
                                />
                            </div>

                            <div className='form-group'>
                                <label htmlFor="year">Year Released</label>
                                <input
                                    type='text'
                                    placeholder='Year Released'
                                    name='year'
                                    className='form-control'
                                    value={this.state.year}
                                    onChange={this.onChange}
                                />
                            </div>

                            <div className='form-group'>
                                <label htmlFor="link">More Info Link</label>
                                <input
                                    type='text'
                                    placeholder='Info Link'
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
                                    placeholder='Image URL'
                                    name='image'
                                    className='form-control'
                                    value={this.state.image}
                                    onChange={this.onChange}
                                />
                            </div>

                            <div className='form-group'>
                                <label htmlFor="favorite">Favorite?</label>
                                <input
                                    type='text'
                                    placeholder='Is a Favorite?'
                                    name='favorite'
                                    className='form-control'
                                    value={this.state.favorite}
                                    onChange={this.onChange}
                                />
                            </div>

                            <button type="submit" className="btn btn-warning btn-lg btn-block">Update Record</button>
                        </form>
                    </div>

                </div>
            </div>
        );
    }
}

export default EditRecord;