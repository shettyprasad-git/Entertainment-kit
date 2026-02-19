import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../axios';
import requests from '../requests';
import Sidebar from '../components/Sidebar';
import './Movie.css';

const base_url = "https://image.tmdb.org/t/p/original/";

function Movie() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [cast, setCast] = useState([]);
    const [videos, setVideos] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [similar, setSimilar] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        async function fetchData() {
            try {
                const movieRequest = await axios.get(requests.fetchMovieDetails(id));
                setMovie(movieRequest.data);

                const castRequest = await axios.get(requests.fetchMovieCredits(id));
                setCast(castRequest.data.cast.slice(0, 10));

                const videosRequest = await axios.get(requests.fetchMovieVideos(id));
                setVideos(videosRequest.data.results);

                const reviewsRequest = await axios.get(requests.fetchMovieReviews(id));
                setReviews(reviewsRequest.data.results);

                const similarRequest = await axios.get(requests.fetchSimilarMovies(id));
                setSimilar(similarRequest.data.results.slice(0, 6));

            } catch (error) {
                console.error("Error fetching movie details:", error);
            }
        }
        fetchData();
        window.scrollTo(0, 0);
    }, [id]);

    if (!movie) return <div className="loading">Loading...</div>;

    const getTrailer = () => {
        const trailer = videos.find(v => v.type === "Trailer" && v.site === "YouTube");
        return trailer ? trailer.key : videos[0]?.key;
    };

    return (
        <div className="movie-page">
            <Sidebar />

            <div
                className="movie-backdrop"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.9)), url("${base_url}${movie.backdrop_path}")`
                }}
            >
                <div className="movie-content">
                    <div className="movie-poster-wrapper">
                        <img
                            src={`${base_url}${movie.poster_path}`}
                            alt={movie.title}
                            className="movie-poster-large"
                        />
                    </div>

                    <div className="movie-info-large">
                        <h1 className="movie-title">{movie.title || movie.original_name}</h1>

                        <div className="movie-meta">
                            <span className="movie-year">{movie.release_date?.substring(0, 4)}</span>
                            <span className="movie-rating">
                                ⭐ {movie.vote_average?.toFixed(1)}
                            </span>
                            <span className="movie-runtime">
                                {movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : ''}
                            </span>
                        </div>

                        <div className="movie-genres">
                            {movie.genres?.map(genre => (
                                <span key={genre.id} className="genre-tag">{genre.name}</span>
                            ))}
                        </div>

                        <p className="movie-overview-large">{movie.overview}</p>

                        <div className="movie-actions">
                            <button className="play-button" onClick={() => window.open(`https://www.youtube.com/watch?v=${getTrailer()}`, '_blank')}>
                                Play Trailer
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="movie-details-section">
                <div className="tabs">
                    <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Cast</button>
                    <button className={`tab-btn ${activeTab === 'videos' ? 'active' : ''}`} onClick={() => setActiveTab('videos')}>Videos</button>
                    <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews</button>
                    <button className={`tab-btn ${activeTab === 'similar' ? 'active' : ''}`} onClick={() => setActiveTab('similar')}>Similar</button>
                </div>

                <div className="tab-content">
                    {activeTab === 'overview' && (
                        <div className="cast-grid">
                            {cast.map(actor => (
                                <div key={actor.id} className="cast-card">
                                    <img
                                        src={actor.profile_path ? `${base_url}${actor.profile_path}` : "https://via.placeholder.com/150"}
                                        alt={actor.name}
                                        className="cast-img"
                                    />
                                    <p className="cast-name">{actor.name}</p>
                                    <p className="cast-character">{actor.character}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'videos' && (
                        <div className="videos-grid">
                            {videos.slice(0, 4).map(video => (
                                <div key={video.id} className="video-card">
                                    <iframe
                                        width="100%"
                                        height="200"
                                        src={`https://www.youtube.com/embed/${video.key}`}
                                        title={video.name}
                                        frameBorder="0"
                                        allowFullScreen
                                    ></iframe>
                                    <p className="video-title">{video.name}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="reviews-list">
                            {reviews.length > 0 ? (
                                reviews.map(review => (
                                    <div key={review.id} className="review-card">
                                        <div className="review-header">
                                            <span className="review-author">{review.author}</span>
                                            <span className="review-date">{new Date(review.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <p className="review-content">{review.content.substring(0, 300)}...</p>
                                        <a href={review.url} target="_blank" rel="noopener noreferrer" className="read-more">Read full review</a>
                                    </div>
                                ))
                            ) : (
                                <p>No reviews available.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'similar' && (
                        <div className="similar-grid">
                            {similar.map(movie => (
                                <div key={movie.id} className="similar-card" onClick={() => navigate(`/movie/${movie.id}`)}>
                                    <img
                                        src={`${base_url}${movie.poster_path}`}
                                        alt={movie.title}
                                        className="similar-poster"
                                    />
                                    <p className="similar-title">{movie.title}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Movie;
