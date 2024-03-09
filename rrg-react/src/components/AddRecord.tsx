import { useState, FormEventHandler } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import axios, {AxiosResponse}  from 'axios';

import { User } from '../shared/types/user';

import '../styles/App.scss';
import infoIcon from './../images/info-icon.png';

type AddRecordProps = {
    baseUrl: string,
    user: User,
    genres: string[],
    tooltipText: any
}

type RecordSubmit = {
    title: string,
    artist: string,
    image: string,
    link: string,
    genre: string,
    favorite: boolean,
    year: number | undefined,
    userId: string,
  }

const AddRecord: React.FC<AddRecordProps> = (props) => {

    const [title, setTitle] = useState<string>("");
    const [artist, setArtist] = useState<string>("");
    const [genre, setGenre] = useState<string>("Classic Rock");
    const [year, setYear] = useState<number>();
    const [link, setLink] = useState<string>("");
    const [image, setImage] = useState<string>("");
    const [favorite, setFavorite] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const history = useHistory();

    // make sure user is logged in
    if (!props.user || !props.user._id) {
        history.push('/login');
    }

    const onSubmit: FormEventHandler = e => {
        e.preventDefault();

        if (!title || !artist) {
            setErrorMessage("Album and Artist names are required.");
            return;
        }

        const recordData: RecordSubmit = {
            title: title,
            artist: artist,
            genre: genre,
            year: year,
            link: link,
            image: image,
            favorite: favorite,
            userId: props.user._id || ""
        };

        axios.post(props.baseUrl + '/records', recordData,
                {
                    headers: {
                        token: localStorage.getItem("jwt") || ""
                    }
                })
                .then((res: AxiosResponse<any>) => {
                    setTitle(res.data.title);
                    setArtist(res.data.artist);
                    setGenre(res.data.genre);
                    setYear(res.data.year);
                    setLink(res.data.link);
                    setImage(res.data.image);
                    setFavorite(res.data.favorite);
                    setUserId(res.data.userId);
                    history.push('/#' + res.data._id);
            })
            .catch(err => {
                setErrorMessage("An Error Occurred");
            })
    };

    return (
        <div className="add-record">
            <div className="container mb-5">
                <div className="row">
                    <div className="col-md-6 m-auto">
                        <h1 className="text-center">Add a Record</h1>
                        <form onSubmit={onSubmit}>
                            <div className='form-group'>
                                <label htmlFor="title">Album Title</label>
                                <input
                                    required
                                    type='text'
                                    name='title'
                                    className='form-control'
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className='form-group'>
                                <label htmlFor="artist">Band or Artist Name</label>
                                <input
                                    required
                                    type='text'
                                    name='artist'
                                    className='form-control'
                                    value={artist}
                                    onChange={(e) => setArtist(e.target.value)}
                                />
                            </div>

                            <div className='form-group'>
                                <label htmlFor="favorite">Genre</label>
                                <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip className="info-tooltip">
                                            {props.tooltipText.genre}
                                        </Tooltip>
                                    }
                                    >
                                    <img className="info-icon" src={infoIcon}></img>
                                </OverlayTrigger>
                                <select
                                    className="form-control"
                                    id="genre"
                                    name="genre"
                                    value={genre}
                                    onChange={(e) => setGenre(e.target.value)}
                                >
                                    {
                                        props.genres.map(genre => {
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
                                    value={year}
                                    onChange={(e) => setYear(parseInt(e.target.value))}
                                />
                            </div>

                            <div className='form-group'>
                                <label htmlFor="link">URL for More Info</label>
                                <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip className="info-tooltip">
                                            {props.tooltipText.link}
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
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                />
                            </div>

                            <div className='form-group'>
                                <label htmlFor="image">Image URL</label>
                                <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip className="info-tooltip">
                                            {props.tooltipText.image}
                                        </Tooltip>
                                    }
                                    >
                                    <img className="info-icon" src={infoIcon}></img>
                                </OverlayTrigger>
                                <input
                                    type='text'
                                    name='image'
                                    className='form-control'
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                />
                            </div>

                            <div className='form-group'>
                                <label htmlFor="favorite">Is this a Favorite?</label>
                                <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip className="info-tooltip">
                                            {props.tooltipText.favorite}
                                        </Tooltip>
                                    }
                                    >
                                    <img className="info-icon" src={infoIcon}></img>
                                </OverlayTrigger>
                                <select
                                    className="form-control"
                                    id="favorite"
                                    name="favorite"
                                    value={favorite ? "true" : "false"}
                                    onChange={(e) => setFavorite(e.target.value === "true")}
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
                        <strong className="text-danger">{errorMessage}</strong>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddRecord;
