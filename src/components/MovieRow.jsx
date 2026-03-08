import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IMAGE_BASE } from '../utils/requests';

export default function MovieRow({ title, fetchUrl, isLargeRow, onSelect, scrollId }) {
  const [movies, setMovies] = useState([]);
  const rowRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      if (!fetchUrl) return;
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

  if (!movies || movies.length === 0) return null;

  return (
    <div id={scrollId} className="ml-5 mb-10 group relative scroll-mt-24">
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
          className="flex overflow-x-scroll overflow-y-hidden p-5 no-scrollbar space-x-4 pb-8"
        >
          {movies.map((movie) => (
            <div key={movie.id} className="flex flex-col items-center shrink-0 w-[150px] md:w-[200px]" onClick={() => onSelect(movie)}>
              <img
                className={`
                  object-contain w-full transition-transform duration-300 
                  hover:scale-110 cursor-pointer rounded-sm shadow-md
                  ${isLargeRow ? 'max-h-[300px] hover:scale-105' : 'max-h-[150px]'}
                `}
                src={`${IMAGE_BASE}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
                alt={movie.name || movie.title}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <p className="mt-2 text-xs md:text-sm font-semibold text-gray-300 text-center w-full truncate px-1">
                {movie.title || movie.name}
              </p>
            </div>
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
}
