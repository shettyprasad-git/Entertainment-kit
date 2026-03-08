import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import InfoModal from '../components/InfoModal';
import { IMAGE_BASE } from '../utils/requests';

export default function CategoryPage({ title, fetchUrl }) {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(fetchUrl);
        const data = await response.json();
        setMovies(data.results || []);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    }
    fetchData();
  }, [fetchUrl]);

  return (
    <div className="bg-[#141414] min-h-screen text-white font-sans overflow-x-hidden">
      <Navbar onSelectMovie={setSelectedMovie} />
      
      <div className="pt-24 px-4 md:px-12 pb-12">
        <h2 className="text-white text-3xl font-bold mb-8 mt-4">{title}</h2>
        
        {movies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
            {movies.map((movie) => (
              <div 
                key={movie.id} 
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => setSelectedMovie(movie)}
              >
                <div className="overflow-hidden rounded-md shadow-lg w-full aspect-[2/3] relative">
                  <img
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    src={`${IMAGE_BASE}${movie.poster_path || movie.backdrop_path}`}
                    alt={movie.name || movie.title}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/300x450?text=No+Image"; }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2">
                     <span className="text-green-500 font-bold text-xs">{Math.round((movie.vote_average || 0) * 10)}% Match</span>
                  </div>
                </div>
                <p className="mt-3 text-sm font-semibold text-gray-300 text-center w-full truncate px-1">
                  {movie.title || movie.name}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
             <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
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
