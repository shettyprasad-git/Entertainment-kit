import React, { useState, useEffect } from 'react';
import axios from '../axios';
import Sidebar from '../components/Sidebar';
import './Search.css';

const API_KEY = "fb2b5673bdb151a36a5c110808e09fbc";

function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.trim().length > 2) {
                try {
                    const response = await axios.get(
                        `/search/movie?api_key=${API_KEY}&language=en-US&query=${query}&page=1&include_adult=false`
                    );
                    setSuggestions(response.data.results.slice(0, 5)); // Limit to 5 suggestions
                    setShowSuggestions(true);
                } catch (error) {
                    console.error("Error fetching suggestions:", error);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            fetchSuggestions();
        }, 300); // 300ms debounce

        return () => clearTimeout(debounceTimer);
    }, [query]);

    const handleSearch = async (e) => {
        e.preventDefault();
        setShowSuggestions(false); // Hide suggestions on search
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

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion.title);
        setShowSuggestions(false);
        // Optionally trigger search immediately or just fill input
        // For better UX, let's trigger the search logic directly with the suggestion
        setResults([suggestion]); // Show the selected suggestion as result immediately 
        // Or fetch full results for that specific movie if needed, but for now this is good feedback
        // Actually, let's just trigger a full search for consistency
        axios.get(
            `/search/movie?api_key=${API_KEY}&language=en-US&query=${suggestion.title}&page=1&include_adult=false`
        ).then(response => {
            setResults(response.data.results);
        }).catch(error => {
            console.error("Error searching movie from suggestion:", error);
        });
    };

    const base_url = "https://image.tmdb.org/t/p/original/";

    return (
        <div className="search-page">
            <Sidebar />
            <div className="search-content">
                <div className="search-bar-container">
                    <form onSubmit={handleSearch} className="search-form">
                        <div className="search-input-wrapper">
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search for movies..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay hiding to allow click
                                onFocus={() => query.length > 2 && setShowSuggestions(true)}
                            />
                            {showSuggestions && suggestions.length > 0 && (
                                <ul className="suggestions-list">
                                    {suggestions.map((movie) => (
                                        <li
                                            key={movie.id}
                                            onClick={() => handleSuggestionClick(movie)}
                                            className="suggestion-item"
                                        >
                                            {movie.poster_path && (
                                                <img
                                                    src={`${base_url}${movie.poster_path}`}
                                                    alt={movie.title}
                                                    className="suggestion-poster"
                                                />
                                            )}
                                            <span className="suggestion-title">{movie.title}</span>
                                            <span className="suggestion-year">
                                                {movie.release_date ? movie.release_date.substring(0, 4) : ''}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
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
