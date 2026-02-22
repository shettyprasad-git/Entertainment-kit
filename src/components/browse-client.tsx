'use client';

import { useState, useMemo } from 'react';
import type { Media } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MediaCard } from '@/components/media-card';
import { useSearchParams } from 'next/navigation';

type BrowseClientProps = {
  allMedia: Media[];
  genres: string[];
};

export function BrowseClient({ allMedia, genres }: BrowseClientProps) {
  const searchParams = useSearchParams();
  const initialGenre = searchParams.get('genre') || 'all';

  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [sortOrder, setSortOrder] = useState('rating-desc');

  const filteredAndSortedMedia = useMemo(() => {
    let filtered =
      selectedGenre === 'all'
        ? allMedia
        : allMedia.filter((media) => media.genres.includes(selectedGenre));

    return filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'rating-desc':
          return b.rating - a.rating;
        case 'rating-asc':
          return a.rating - b.rating;
        case 'year-desc':
          return b.releaseYear - a.releaseYear;
        case 'year-asc':
          return a.releaseYear - b.releaseYear;
        default:
          return 0;
      }
    });
  }, [selectedGenre, sortOrder, allMedia]);

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Browse</h1>
        <div className="flex items-center gap-4">
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating-desc">Rating (High to Low)</SelectItem>
              <SelectItem value="rating-asc">Rating (Low to High)</SelectItem>
              <SelectItem value="year-desc">Year (Newest First)</SelectItem>
              <SelectItem value="year-asc">Year (Oldest First)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {filteredAndSortedMedia.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filteredAndSortedMedia.map((media) => (
            <MediaCard key={media.id} media={media} />
          ))}
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
          <p className="text-muted-foreground">No results found.</p>
        </div>
      )}
    </>
  );
}
