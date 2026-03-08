import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import InfoModal from '../components/InfoModal';
import { IMAGE_BASE } from '../utils/requests';
import { Trash2 } from 'lucide-react';

export default function MyList() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const profileId = JSON.parse(localStorage.getItem('activeProfile'))?.id;

  const fetchMyList = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://entertainment-kit-backend.vercel.app/my-list/${profileId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMovies(response.data.map(item => item.data));
    } catch (error) {
      console.error("Error fetching my list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileId) {
      fetchMyList();
    }
  }, [profileId]);

  const removeFromList = async (e, movieId) => {
    e.stopPropagation(); // Prevent opening the modal
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://entertainment-kit-backend.vercel.app/my-list/${profileId}/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Remove from UI
      setMovies(movies.filter(movie => movie.id !== movieId));
    } catch (err) {
      console.error("Failed to remove from list:", err);
    }
  };

  return (
    <div className="bg-[#141414] min-h-screen text-white font-sans overflow-x-hidden">
      <Navbar onSelectMovie={setSelectedMovie} />
      
      <div className="pt-24 px-4 md:px-12 pb-12">
        <h2 className="text-white text-3xl font-bold mb-8 mt-4">My List</h2>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
             <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
            {movies.map((movie) => (
              <div 
                key={movie.id} 
                className="flex flex-col items-center cursor-pointer group relative"
                onClick={() => setSelectedMovie(movie)}
              >
                <div className="overflow-hidden rounded-md shadow-lg w-full aspect-[2/3] relative">
                  <img
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    src={`${IMAGE_BASE}${movie.poster_path || movie.backdrop_path}`}
                    alt={movie.name || movie.title}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/300x450?text=No+Image"; }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-2">
                     <button 
                       onClick={(e) => removeFromList(e, movie.id)}
                       className="bg-black/80 hover:bg-red-600 text-white p-3 rounded-full transition-colors flex items-center justify-center"
                       title="Remove from My List"
                     >
                        <Trash2 size={24} />
                     </button>
                  </div>
                </div>
                <p className="mt-3 text-sm font-semibold text-gray-300 text-center w-full truncate px-1">
                  {movie.title || movie.name}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
             <p className="text-2xl font-bold mb-2">Your list is empty.</p>
             <p>Add shows and movies that you want to watch later by clicking the + icon.</p>
          </div>
        )}
      </div>

      {selectedMovie && (
        <InfoModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}
    </div>
  );
}
