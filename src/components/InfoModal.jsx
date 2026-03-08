import React, { useState, useEffect } from 'react';
import { X, Play, Plus, Check } from 'lucide-react';
import axios from 'axios';
import { BASE_URL, API_KEY, IMAGE_BASE } from '../utils/requests';

export default function InfoModal({ movie, onClose }) {
  const [trailerUrl, setTrailerUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    if (movie && showTrailer) {
      setLoading(true);
      fetch(`${BASE_URL}/${movie.media_type === 'tv' ? 'tv' : 'movie'}/${movie.id}/videos?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
          if (data.results && data.results.length > 0) {
            const trailer = data.results.find(vid => vid.type === "Trailer" || vid.type === "Teaser");
            setTrailerUrl(trailer ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1` : "");
          } else {
            setTrailerUrl("");
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching trailer:", err);
          setTrailerUrl("");
          setLoading(false);
        });
    }
  }, [movie, showTrailer]);

  const addToMyList = async () => {
    try {
      const token = localStorage.getItem('token');
      const profileId = JSON.parse(localStorage.getItem('activeProfile'))?.id;
      
      if (!profileId) {
        alert("Please select a profile first.");
        return;
      }

      await axios.post('https://entertainment-kit-backend.vercel.app/my-list', {
        profile_id: profileId,
        movie_id: movie.id,
        movie_data: movie
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Added to My List!');
    } catch (err) {
      if (err.response && err.response.status === 409) {
        alert("This is already in your list!");
      } else {
        console.error("Failed to add to list:", err);
        alert("Failed to add to My List");
      }
    }
  };

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-[#181818] w-full max-w-4xl rounded-lg overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-[#181818] rounded-full p-2 text-white hover:bg-white/20 transition"
        >
          <X size={24} />
        </button>

        {!showTrailer ? (
          <>
            <div className="relative h-64 md:h-96">
              <img 
                src={`${IMAGE_BASE}${movie.backdrop_path || movie.poster_path}`} 
                alt={movie.title || movie.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
                  {movie.title || movie.name}
                </h2>
                <div className="flex space-x-4">
                  <button 
                    onClick={() => setShowTrailer(true)}
                    className="flex items-center bg-white text-black px-8 py-2 md:py-3 rounded font-bold hover:bg-gray-200 transition transform hover:scale-105"
                  >
                    <Play className="fill-current mr-2" size={20} /> Play Trailer
                  </button>
                  <button 
                    onClick={addToMyList}
                    className="flex items-center border border-gray-500 bg-black/40 text-white px-8 py-2 md:py-3 rounded font-bold hover:bg-white/20 transition backdrop-blur-sm"
                  >
                    <Plus className="mr-2" size={24} /> My List
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center space-x-4 text-sm font-bold">
                  <span className="text-green-500">{Math.round(movie.vote_average * 10)}% Match</span>
                  <span>{movie.release_date ? movie.release_date.substring(0,4) : movie.first_air_date ? movie.first_air_date.substring(0,4) : ''}</span>
                  <span className="border border-gray-600 px-1.5 py-0.5 rounded text-xs">HD</span>
                </div>
                <p className="text-sm md:text-base leading-relaxed text-gray-300 font-medium">
                  {movie.overview}
                </p>
              </div>
              <div className="text-sm text-gray-400 space-y-2">
                <p><span className="text-gray-500">Language:</span> {movie.original_language?.toUpperCase()}</p>
                <p><span className="text-gray-500">Popularity:</span> {movie.popularity}</p>
                <p><span className="text-gray-500">Votes:</span> {movie.vote_count}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="aspect-video w-full bg-black">
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
                <button onClick={() => setShowTrailer(false)} className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200">
                  Go Back
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
