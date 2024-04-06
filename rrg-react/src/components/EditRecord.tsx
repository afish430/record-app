import { useState, useEffect, FormEventHandler } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import axios, {AxiosResponse}  from 'axios';

import { Record } from '../types/record';
import { RecordSubmit } from '../types/recordSubmit';
import { User } from '../types/user';
import { TooltipText } from '../types/tooltipText';
import genres from '../types/genres';

import '../styles/App.scss';
import infoIcon from './../images/info-icon.png';

type EditRecordProps = {
    baseUrl: string,
    user: User,
    tooltipText: TooltipText,
    match: any,
    savedGenre: string,
    setSavedGenre(savedGenre: string): void
}

const EditRecord: React.FC<EditRecordProps> = (props) => {

    const [title, setTitle] = useState<string>("");
    const [artist, setArtist] = useState<string>("");
    const [genre, setGenre] = useState<string>("");
    const [year, setYear] = useState<number>(0);
    const [link, setLink] = useState<string>("");
    const [image, setImage] = useState<string>("");
    const [favorite, setFavorite] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const history = useHistory();

    // make sure user is logged in:
    if (!props.user || !props.user._id) {
        history.push('/login');
    }

    useEffect(() => {
        axios.get(props.baseUrl + "/records/" + props.match.params.id,
                {
                    headers: {
                        token: localStorage.getItem("jwt") || ""
                    }
                })
            .then((res: AxiosResponse<Record>) => {
                setTitle(res.data.title);
                setArtist(res.data.artist);
                setGenre(res.data.genre);
                setYear(res.data.year);
                setLink(res.data.link);
                setImage(res.data.image);
                setFavorite(res.data.favorite);
                setUserId(res.data.userId);
            })
            .catch(err => {
                console.log("Error in EditRecord");
            })
        }, []);

        const onSubmit: FormEventHandler = e => {
            e.preventDefault();

            if (!title || !artist) {
                setErrorMessage('Album and Artist names are required.');
                return;
            }

            const recordToEdit: RecordSubmit = {
                title: title,
                artist: artist,
                genre: genre,
                year: year,
                link: link,
                image: image,
                favorite: favorite,
                userId: userId
            };

            axios.put(props.baseUrl + "/records/" + props.match.params.id, recordToEdit,
                {
                    headers: {
                        token: localStorage.getItem("jwt") || ""
                    }
                })
                .then(res => {
                    if (props.savedGenre && props.savedGenre != recordToEdit.genre)
                    {
                        props.setSavedGenre('Any');
                    }
                    history.push('/#' + props.match.params.id);
                })
                .catch(err => {
                    setErrorMessage('An error occurred.');
                })
        };

        return (
            <div className="edit-record">
                <div className="container mb-5">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="text-center">Edit Record</h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 m-auto">
                            <form onSubmit={onSubmit}>
                                <div className='form-group'>
                                    <label htmlFor="title">Album Title</label>
                                    <input
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
                                            genres.map(genre => {
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

                                <Link to={"/#" + props.match.params.id} className="btn btn-light float-left">
                                Cancel
                                </Link>
                                <button type="submit" className="btn btn-info mb-2 float-right">Update Record</button>
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

export default EditRecord;