import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import axios from 'axios';


class AddRecord extends Component {
    constructor() {
        super();
        this.state = {
            title: '',
            artist: '',
            genre: '',
            year: '',
            link: '',
            image: '',
            favorite: ''
        };
    }

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
            .post('http://localhost:8082/api/records', data)
            .then(res => {
                this.setState({
                    title: '',
                    artist: '',
                    genre: '',
                    year: '',
                    link: '',
                    image: '',
                    favorite: ''
                })
                this.props.history.push('/manage-records');
            })
            .catch(err => {
                console.log("Error in AddRecord!");
            })
    };

    render() {
        return (
            <div className="AddRecord">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <Link to="/manage-records" className="btn btn-warning float-left">
                                &#8592; Back to Records List
                            </Link>
                        </div>
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Add a Record</h1>
                            <form noValidate onSubmit={this.onSubmit}>
                                <div className='form-group'>
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
                                    <input
                                        type='text'
                                        placeholder='Band or Artist Name'
                                        name='artist'
                                        className='form-control'
                                        value={this.state.artist}
                                        onChange={this.onChange}
                                    />
                                </div>

                                <div className='form-group'>
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
                                    <input
                                        type='text'
                                        placeholder='Album Release Year'
                                        name='year'
                                        className='form-control'
                                        value={this.state.year}
                                        onChange={this.onChange}
                                    />
                                </div>

                                <div className='form-group'>
                                    <input
                                        type='text'
                                        placeholder='Album Info URL'
                                        name='link'
                                        className='form-control'
                                        value={this.state.link}
                                        onChange={this.onChange}
                                    />
                                </div>

                                <div className='form-group'>
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
                                    <input
                                        type='text'
                                        placeholder='Is this a Favorite?'
                                        name='favorite'
                                        className='form-control'
                                        value={this.state.favorite}
                                        onChange={this.onChange}
                                    />
                                </div>

                                <input
                                    type="submit"
                                    className="btn btn-warning btn-block mt-4"
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddRecord;
