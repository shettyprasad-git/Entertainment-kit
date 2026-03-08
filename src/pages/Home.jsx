import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Info, Plus, X, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

import { requests, IMAGE_BASE } from '../utils/requests';
import MovieRow from '../components/MovieRow';
import InfoModal from '../components/InfoModal';

// --- Main App Component ---

export default function Home() {
  const navigate = useNavigate();
  const [activeProfile, setActiveProfile] = useState(null);
  const [moviesList, setMoviesList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [muted, setMuted] = useState(true);
  const [fade, setFade] = useState(true);

  // Auth Redirects
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const profile = localStorage.getItem('activeProfile');
    if (!profile) {
      navigate('/profile');
      return;
    }
    setActiveProfile(JSON.parse(profile));
  }, [navigate]);

  // Initial fetch for top 5 trending movies
  useEffect(() => {
    async function fetchInitialData() {
      try {
        const trResponse = await fetch(requests.trending);
        const trData = await trResponse.json();
        const top5 = trData.results.filter(m => m.backdrop_path).slice(0, 5);
        setMoviesList(top5);
        if (top5.length > 0) setFeaturedMovie(top5[0]);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    }
    fetchInitialData();
  }, []);

  // Search autocomplete hook
  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => {
            const results = data.results.filter(m => m.backdrop_path || m.poster_path).slice(0, 5);
            setSearchResults(results);
        });
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Handle clicking outside of search to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchActive(false);
        setSearchQuery('');
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
      
      {/* Extracted Navbar Component */}
      <Navbar onSelectMovie={setSelectedMovie} />

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
          scrollId="tv-shows"
          title="Netflix Originals" 
          fetchUrl={requests.originals} 
          isLargeRow 
          onSelect={setSelectedMovie} 
        />
        <MovieRow 
          scrollId="new-popular"
          title="Trending Now" 
          fetchUrl={requests.trending} 
          onSelect={setSelectedMovie} 
        />
        <MovieRow 
          scrollId="movies"
          title="Top Rated Movies" 
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
          scrollId="my-list"
          title="Romance & Drama" 
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
        <InfoModal 
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
