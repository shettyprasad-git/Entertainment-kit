export type Media = {
  id: string;
  title: string;
  description: string;
  posterPath: string;
  backdropPath: string;
  genres: string[];
  type: 'movie' | 'tv';
  releaseYear: number;
  rating: number;
  cast: { name: string; character: string; profilePath: string }[];
  trailerUrl?: string;
  reason?: string;
};

export type ViewingHistoryItem = {
  title: string;
  type: 'movie' | 'tv';
  genres: string[];
};
