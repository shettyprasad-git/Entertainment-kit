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
import { Button } from '@/components/ui/button';
import { MediaCard } from '@/components/media-card';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Card } from '@/components/ui/card';

type BrowseClientProps = {
  allMedia: Media[];
  genres: string[];
};

export function BrowseClient({ allMedia, genres }: BrowseClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialGenre = searchParams.get('genre') || 'all';
  const initialType = searchParams.get('type') || 'all';

  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [selectedType, setSelectedType] = useState<'all' | 'movie' | 'tv'>(initialType as any);
  const [sortOrder, setSortOrder] = useState('rating-desc');

  const updateURLParams = (paramsToUpdate: { [key: string]: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(paramsToUpdate).forEach(([key, value]) => {
      if (value === 'all') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleTypeChange = (type: 'all' | 'movie' | 'tv') => {
    setSelectedType(type);
    updateURLParams({ type });
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    updateURLParams({ genre });
  };

  const filteredAndSortedMedia = useMemo(() => {
    let filtered = allMedia;

    if (selectedType !== 'all') {
      filtered = filtered.filter((media) => media.type === selectedType);
    }
    
    if (selectedGenre !== 'all') {
      filtered = filtered.filter((media) => media.genres.includes(selectedGenre));
    }

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
  }, [selectedGenre, selectedType, sortOrder, allMedia]);

  return (
    <>
      <div className="mb-8">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">Browse</h1>
        <Card className="bg-card p-4 backdrop-blur-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                  <Button variant={selectedType === 'all' ? 'secondary' : 'ghost'} onClick={() => handleTypeChange('all')}>All</Button>
                  <Button variant={selectedType === 'movie' ? 'secondary' : 'ghost'} onClick={() => handleTypeChange('movie')}>Movies</Button>
                  <Button variant={selectedType === 'tv' ? 'secondary' : 'ghost'} onClick={() => handleTypeChange('tv')}>TV Shows</Button>
              </div>
              <div className="flex items-center gap-4">
              <Select value={selectedGenre} onValueChange={handleGenreChange}>
                  <SelectTrigger className="w-full sm:w-[180px]">
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
                  <SelectTrigger className="w-full sm:w-[180px]">
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
        </Card>
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
