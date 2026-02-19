import React, { useState } from 'react';
import axios from '../axios';
import Sidebar from '../components/Sidebar';
import './Search.css';

const API_KEY = "fb2b5673bdb151a36a5c110808e09fbc";

function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (query.trim()) {
            try {
                const response = await axios.get(
                    `/search/movie?api_key=${API_KEY}&language=en-US&query=${query}&page=1&include_adult=false`
                );
                setResults(response.data.results);
            } catch (error) {
                console.error("Error searching movies:", error);
            }
        }
    };

    const base_url = "https://image.tmdb.org/t/p/original/";

    return (
        <div className="search-page">
            <Sidebar />
            <div className="search-content">
                <div className="search-bar-container">
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search for movies..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button type="submit" className="search-button">Search</button>
                    </form>
                </div>

                <div className="search-results">
                    {results.map((movie) => (
                        movie.poster_path && (
                            <div key={movie.id} className="movie-card">
                                <img
                                    src={`${base_url}${movie.poster_path}`}
                                    alt={movie.title}
                                    className="movie-poster"
                                />
                                <div className="movie-info">
                                    <h3>{movie.title}</h3>
                                    <span className={`rating ${movie.vote_average >= 8 ? 'green' : movie.vote_average >= 6 ? 'orange' : 'red'}`}>
                                        {movie.vote_average?.toFixed(1)}
                                    </span>
                                </div>
                                <div className="movie-overview">
                                    <h2>Overview:</h2>
                                    <p>{movie.overview}</p>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Search;
