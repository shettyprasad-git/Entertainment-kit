import React, { useState, useEffect, useCallback } from 'react';
import { Play, Info, Plus, X, Volume2, VolumeX, ChevronLeft, ChevronRight, Search, Bell } from 'lucide-react';

// --- Constants ---
const API_KEY = "fb2b5673bdb151a36a5c110808e09fbc";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/original";

const requests = {
  trending: `${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=en-US`,
  originals: `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_networks=213`,
  topRated: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US`,
  action: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28`,
  comedy: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35`,
  horror: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=27`,
  romance: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=10749`,
  documentaries: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=99`,
};

// --- Helper Components ---

const MovieRow = ({ title, fetchUrl, isLargeRow, onSelect }) => {
  const [movies, setMovies] = useState([]);
  const rowRef = React.useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(fetchUrl);
        const data = await response.json();
        setMovies(data.results || []);
      } catch (error) {
        console.error("Error fetching row data:", error);
      }
    }
    fetchData();
  }, [fetchUrl]);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="ml-5 mb-10 group relative">
      <h2 className="text-white text-2xl font-bold mb-4">{title}</h2>
      
      <div className="relative flex items-center">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 z-20 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-black focus:outline-none"
        >
          <ChevronLeft size={30} />
        </button>

        <div 
          ref={rowRef}
          className="flex overflow-x-scroll overflow-y-hidden p-5 no-scrollbar space-x-4"
        >
          {movies.map((movie) => (
            <img
              key={movie.id}
              onClick={() => onSelect(movie)}
              className={`
                max-h-[250px] object-contain w-full transition-transform duration-300 
                hover:scale-110 cursor-pointer rounded-sm
                ${isLargeRow ? 'max-h-[400px] hover:scale-105' : ''}
              `}
              src={`${IMAGE_BASE}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
              alt={movie.name || movie.title}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 z-20 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-black focus:outline-none"
        >
          <ChevronRight size={30} />
        </button>
      </div>
    </div>
  );
};

const TrailerModal = ({ movie, onClose }) => {
  const [trailerUrl, setTrailerUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (movie) {
      setLoading(true);
      fetch(`${BASE_URL}/${movie.media_type === 'tv' ? 'tv' : 'movie'}/${movie.id}/videos?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
          const trailer = data.results?.find(v => v.type === "Trailer" && v.site === "YouTube") || data.results?.[0];
          if (trailer) {
            setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}?autoplay=1&controls=1&modestbranding=1&rel=0`);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [movie]);

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-0 md:p-4">
      <div className="relative w-full max-w-6xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-[60] bg-black/60 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-300"
        >
          <X size={28} />
        </button>
        
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : trailerUrl ? (
          <iframe
            className="w-full h-full"
            src={trailerUrl}
            title="Movie Trailer"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white space-y-4">
            <div className="bg-red-600/20 p-6 rounded-full">
              <X size={48} className="text-red-600" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">Trailer Not Found</p>
              <p className="text-gray-400">{movie.title || movie.name}</p>
            </div>
            <button onClick={onClose} className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [moviesList, setMoviesList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [muted, setMuted] = useState(true);
  const [fade, setFade] = useState(true);

  // Navbar background change on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initial fetch for top 5 trending movies
  useEffect(() => {
    async function fetchTopTrending() {
      try {
        const response = await fetch(requests.trending);
        const data = await response.json();
        // Get the top 5 trending movies with a backdrop
        const top5 = data.results.filter(m => m.backdrop_path).slice(0, 5);
        setMoviesList(top5);
        if (top5.length > 0) {
          setFeaturedMovie(top5[0]);
        }
      } catch (error) {
        console.error("Failed to fetch featured:", error);
      }
    }
    fetchTopTrending();
  }, []);

  // Rotate through the top 5 trending movies every 15 seconds
  useEffect(() => {
    if (moviesList.length === 0) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % moviesList.length;
          setFeaturedMovie(moviesList[nextIndex]);
          return nextIndex;
        });
        setFade(true);
      }, 500); // Wait for fade out before changing movie
    }, 15000); // Change every 15s

    return () => clearInterval(interval);
  }, [moviesList]);

  const truncate = (str, n) => str?.length > n ? str.substr(0, n - 1) + "..." : str;

  return (
    <div className="bg-[#141414] min-h-screen text-white font-sans selection:bg-red-600 overflow-x-hidden">
      
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-700 flex items-center justify-between px-4 md:px-12 py-3 ${isScrolled ? 'bg-[#141414] shadow-xl' : 'bg-gradient-to-b from-black/70 to-transparent'}`}>
        <div className="flex items-center space-x-4 md:space-x-10">
          <div className="flex items-center cursor-pointer hover:scale-105 transition-transform">
            <img src="/logo.png" alt="Logo" className="h-8 md:h-10 w-auto mr-3 object-contain" />
            <h1 className="text-red-600 text-2xl md:text-3xl font-black tracking-tighter hidden sm:block">
              ENTERTAINMENT KIT
            </h1>
          </div>
          <ul className="hidden lg:flex space-x-6 text-sm font-medium">
            <li className="hover:text-gray-300 cursor-pointer transition">Home</li>
            <li className="hover:text-gray-300 cursor-pointer transition">TV Shows</li>
            <li className="hover:text-gray-300 cursor-pointer transition">Movies</li>
            <li className="hover:text-gray-300 cursor-pointer transition">New & Popular</li>
            <li className="hover:text-gray-300 cursor-pointer transition">My List</li>
          </ul>
        </div>
        
        <div className="flex items-center space-x-4 md:space-x-6">
          <Search className="w-5 h-5 cursor-pointer hover:text-red-600 transition" />
          <Bell className="w-5 h-5 cursor-pointer hover:text-red-600 transition" />
          <div className="w-8 h-8 bg-blue-600 rounded cursor-pointer ring-2 ring-transparent hover:ring-white transition"></div>
        </div>
      </nav>

      {/* Hero Banner with Anti-Gravity Fade Transition */}
      {featuredMovie && (
        <header 
          className={`relative h-[90vh] text-white flex items-center transition-opacity duration-1000 ${fade ? 'opacity-100' : 'opacity-0'}`}
          style={{
            backgroundSize: "cover",
            backgroundImage: `url("${IMAGE_BASE}${featuredMovie.backdrop_path}")`,
            backgroundPosition: "center 20%",
          }}
        >
          {/* Visual Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 w-full h-64 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent"></div>

          <div className="relative z-10 px-4 md:ml-12 max-w-3xl animate-in fade-in slide-in-from-left-10 duration-1000">
            <h1 className="text-4xl md:text-7xl font-extrabold pb-4 drop-shadow-2xl">
              {featuredMovie.title || featuredMovie.name || featuredMovie.original_name}
            </h1>
            
            <div className="flex space-x-3 mb-6">
              <button 
                onClick={() => setSelectedMovie(featuredMovie)}
                className="flex items-center bg-white text-black px-6 md:px-10 py-2.5 rounded font-bold hover:bg-white/80 transition transform hover:scale-105 active:scale-95 shadow-lg"
              >
                <Play className="fill-current mr-2" size={24} /> Play
              </button>
              <button className="flex items-center bg-gray-500/60 text-white px-6 md:px-10 py-2.5 rounded font-bold hover:bg-gray-500/40 transition transform hover:scale-105 shadow-lg backdrop-blur-sm">
                <Info className="mr-2" size={24} /> More Info
              </button>
            </div>

            <p className="text-sm md:text-xl leading-relaxed drop-shadow-lg font-medium text-gray-200">
              {truncate(featuredMovie.overview, 200)}
            </p>
          </div>

          <div className="absolute bottom-24 right-0 flex items-center space-x-4 pr-4 md:pr-12 z-20">
            <button 
              onClick={() => setMuted(!muted)}
              className="p-2 border-2 border-white/50 rounded-full hover:bg-white/10 transition-colors"
            >
              {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <span className="bg-black/40 border-l-4 border-white px-4 py-1.5 text-sm font-bold backdrop-blur-md">
              18+
            </span>
          </div>
        </header>
      )}

      {/* Content Layers */}
      <div className="relative z-30 -mt-24 md:-mt-48 pb-12">
        <MovieRow 
          title="Netflix Originals" 
          fetchUrl={requests.originals} 
          isLargeRow 
          onSelect={setSelectedMovie} 
        />
        <MovieRow 
          title="Trending Now" 
          fetchUrl={requests.trending} 
          onSelect={setSelectedMovie} 
        />
        <MovieRow 
          title="Top Rated" 
          fetchUrl={requests.topRated} 
          onSelect={setSelectedMovie} 
        />
        <MovieRow 
          title="Action Thrillers" 
          fetchUrl={requests.action} 
          onSelect={setSelectedMovie} 
        />
        <MovieRow 
          title="Comedy Night" 
          fetchUrl={requests.comedy} 
          onSelect={setSelectedMovie} 
        />
        <MovieRow 
          title="Scary Movies" 
          fetchUrl={requests.horror} 
          onSelect={setSelectedMovie} 
        />
        <MovieRow 
          title="Romance" 
          fetchUrl={requests.romance} 
          onSelect={setSelectedMovie} 
        />
      </div>

      {/* Footer Section */}
      <footer className="py-16 px-6 text-gray-500 text-sm max-w-6xl mx-auto border-t border-gray-800/50 mt-10">
        <div className="flex space-x-6 text-gray-400 mb-8">
          <span className="cursor-pointer hover:text-white transition">Facebook</span>
          <span className="cursor-pointer hover:text-white transition">Instagram</span>
          <span className="cursor-pointer hover:text-white transition">Twitter</span>
          <span className="cursor-pointer hover:text-white transition">YouTube</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8 mb-10">
          <p className="hover:underline cursor-pointer">Audio and Subtitles</p>
          <p className="hover:underline cursor-pointer">Help Center</p>
          <p className="hover:underline cursor-pointer">Gift Cards</p>
          <p className="hover:underline cursor-pointer">Media Center</p>
          <p className="hover:underline cursor-pointer">Investor Relations</p>
          <p className="hover:underline cursor-pointer">Jobs</p>
          <p className="hover:underline cursor-pointer">Terms of Use</p>
          <p className="hover:underline cursor-pointer">Privacy</p>
          <p className="hover:underline cursor-pointer">Legal Notices</p>
          <p className="hover:underline cursor-pointer">Cookie Preferences</p>
          <p className="hover:underline cursor-pointer">Corporate Information</p>
          <p className="hover:underline cursor-pointer">Contact Us</p>
        </div>

        <button className="border border-gray-600 px-4 py-2 text-xs hover:text-white hover:border-white transition-all uppercase tracking-widest">
          Service Code
        </button>

        <p className="mt-8 text-[11px] uppercase tracking-tight">© 1997-2024 Entertainment Kit, Inc.</p>
      </footer>

      {/* Trailer Overlay */}
      {selectedMovie && (
        <TrailerModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}

      {/* Optimized Styles */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
