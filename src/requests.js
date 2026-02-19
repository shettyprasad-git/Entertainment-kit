const API_KEY = "fb2b5673bdb151a36a5c110808e09fbc";

const requests = {
    fetchTrending: `/trending/all/week?api_key=${API_KEY}&language=en-US`,
    fetchNetflixOriginals: `/discover/tv?api_key=${API_KEY}&with_networks=213`,
    fetchTopRated: `/movie/top_rated?api_key=${API_KEY}&language=en-US`,
    fetchActionMovies: `/discover/movie?api_key=${API_KEY}&with_genres=28`,
    fetchComedyMovies: `/discover/movie?api_key=${API_KEY}&with_genres=35`,
    fetchHorrorMovies: `/discover/movie?api_key=${API_KEY}&with_genres=27`,
    fetchRomanceMovies: `/discover/movie?api_key=${API_KEY}&with_genres=10749`,
    fetchDocumentaries: `/discover/movie?api_key=${API_KEY}&with_genres=99`,
    fetchMovieDetails: (movieId) => `/movie/${movieId}?api_key=${API_KEY}&language=en-US`,
    fetchMovieCredits: (movieId) => `/movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`,
    fetchMovieVideos: (movieId) => `/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`,
    fetchMovieReviews: (movieId) => `/movie/${movieId}/reviews?api_key=${API_KEY}&language=en-US&page=1`,
    fetchSimilarMovies: (movieId) => `/movie/${movieId}/similar?api_key=${API_KEY}&language=en-US&page=1`,
};

export default requests;
