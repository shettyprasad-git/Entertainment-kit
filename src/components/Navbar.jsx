import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Clapperboard, LogOut, Users, X } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const API_KEY = "fb2b5673bdb151a36a5c110808e09fbc";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/original";

export default function Navbar({ onSelectMovie }) {
  const navigate = useNavigate();
  const [activeProfile, setActiveProfile] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    const profile = localStorage.getItem('activeProfile');
    if (profile) setActiveProfile(JSON.parse(profile));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('activeProfile');
    navigate('/login');
  };

  const handleSwitchProfile = () => {
    navigate('/profile');
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const notifResponse = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US`);
        const notifData = await notifResponse.json();
        setNotifications(notifData.results.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    }
    fetchNotifications();
  }, []);

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

  return (
    <nav className={`fixed top-0 w-full z-40 transition-all duration-700 flex items-center justify-between px-4 md:px-12 py-3 ${isScrolled ? 'bg-[#141414] shadow-xl' : 'bg-gradient-to-b from-black/70 to-transparent'}`}>
      <div className="flex items-center space-x-4 md:space-x-10">
        <Link to="/" className="flex items-center cursor-pointer hover:scale-105 transition-transform">
          <Clapperboard className="text-red-600 mr-2 h-8 w-8 md:h-10 md:w-10" />
          <h1 className="text-red-600 text-2xl md:text-3xl font-black tracking-tighter hidden sm:block">
            ENTERTAINMENT KIT
          </h1>
        </Link>
        <ul className="hidden lg:flex space-x-6 text-sm font-medium">
          <Link to="/" className="hover:text-gray-300 cursor-pointer transition">Home</Link>
          <Link to="/tv-shows" className="hover:text-gray-300 cursor-pointer transition">TV Shows</Link>
          <Link to="/movies" className="hover:text-gray-300 cursor-pointer transition">Movies</Link>
          <Link to="/new-popular" className="hover:text-gray-300 cursor-pointer transition">New & Popular</Link>
          <Link to="/my-list" className="hover:text-gray-300 cursor-pointer transition">My List</Link>
        </ul>
      </div>
      
      <div className="flex items-center space-x-4 md:space-x-6">
        
        {/* Search Bar */}
        <div ref={searchRef} className="relative flex items-center">
          {isSearchActive ? (
            <div className="flex items-center bg-black/60 border border-white/50 px-2 py-1 rounded transition-all animate-in slide-in-from-right-4 duration-300">
              <Search size={18} className="text-white mr-2" />
              <input 
                autoFocus
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Titles, people, genres"
                className="bg-transparent text-white text-sm outline-none w-32 md:w-64 placeholder-gray-400"
              />
              <X size={18} className="text-gray-400 hover:text-white cursor-pointer ml-2" onClick={() => { setIsSearchActive(false); setSearchQuery(''); }} />
              
              {/* Search Autocomplete Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-10 right-0 w-72 bg-[#141414] border border-gray-800 rounded shadow-2xl z-50 overflow-hidden">
                  {searchResults.map(res => (
                    <div 
                      key={res.id} 
                      onClick={() => { onSelectMovie(res); setIsSearchActive(false); setSearchQuery(''); }}
                      className="flex items-center p-3 border-b border-gray-800 hover:bg-gray-800 cursor-pointer transition"
                    >
                       <img src={`${IMAGE_BASE}${res.poster_path || res.backdrop_path}`} alt="poster" className="w-10 h-14 object-cover rounded mr-3" />
                       <div>
                          <p className="text-sm font-bold text-white truncate max-w-[180px]">{res.title || res.name}</p>
                          <p className="text-xs text-gray-400">{res.media_type === 'movie' ? 'Movie' : 'TV Show'} • {res.release_date ? res.release_date.substring(0,4) : res.first_air_date ? res.first_air_date.substring(0,4) : ''}</p>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Search className="w-5 h-5 cursor-pointer hover:text-gray-300 transition" onClick={() => setIsSearchActive(true)} />
          )}
        </div>

        {/* Notifications */}
        <div className="relative group">
          <Bell className="w-5 h-5 cursor-pointer hover:text-gray-300 transition" />
          <div className="absolute right-0 top-6 w-80 bg-[#141414]/95 backdrop-blur-md border border-gray-800 rounded shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
             <div className="p-4 border-b border-gray-800 bg-gray-900/50">
               <span className="font-bold text-sm text-white">Newest Releases</span>
             </div>
             <div className="max-h-80 overflow-y-auto no-scrollbar">
               {notifications.length > 0 ? notifications.map(notif => (
                 <div key={notif.id} onClick={() => onSelectMovie(notif)} className="flex items-start p-4 border-b border-gray-800/50 hover:bg-gray-800/80 cursor-pointer transition">
                   <img src={`${IMAGE_BASE}${notif.poster_path || notif.backdrop_path}`} alt="poster" className="w-20 h-12 object-cover rounded mr-4" />
                   <div className="flex-1">
                      <p className="text-white text-sm font-semibold truncate max-w-[180px]">{notif.title}</p>
                      <p className="text-xs text-blue-500 mt-1">Now Playing</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notif.overview}</p>
                   </div>
                 </div>
               )) : (
                 <div className="p-4 text-center text-sm text-gray-500">No new notifications.</div>
               )}
             </div>
          </div>
        </div>
        
        {/* Profile Dropdown */}
        <div className="relative group cursor-pointer border border-transparent rounded ring-0 hover:ring-2 ring-white/50 transition">
          <div className={`w-8 h-8 rounded shrink-0 transition flex items-center justify-center ${activeProfile ? activeProfile.color : 'bg-gray-600'}`}>
            <span className="text-white font-bold text-sm">
              {activeProfile ? activeProfile.name.charAt(0).toUpperCase() : '?'}
            </span>
          </div>
          <div className="absolute right-0 top-10 w-56 bg-[#141414]/95 backdrop-blur-md border border-gray-800 rounded shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
            <div className="p-4 border-b border-gray-800 flex items-center space-x-3 bg-gray-900/50">
              <div className={`w-10 h-10 rounded shrink-0 flex items-center justify-center ${activeProfile ? activeProfile.color : 'bg-gray-600'}`}>
                <span className="text-white font-black text-lg">
                  {activeProfile ? activeProfile.name.charAt(0).toUpperCase() : '?'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-white truncate max-w-[110px]">{activeProfile ? activeProfile.name : 'User'}</span>
                <span className="text-xs text-gray-500">Active Profile</span>
              </div>
            </div>
            <div className="py-2 border-b border-gray-800/50">
              <button 
                onClick={handleSwitchProfile}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 flex items-center transition"
              >
                <Users size={16} className="mr-3 text-gray-400" /> Switch Profile
              </button>
            </div>
            <div className="py-2">
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:text-red-500 hover:bg-red-500/10 flex items-center transition"
              >
                <LogOut size={16} className="mr-3 text-gray-400" /> Sign out of Kit
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
