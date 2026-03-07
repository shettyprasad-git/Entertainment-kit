import type { Media, ViewingHistoryItem } from '@/types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

export const genres = ["Action", "Comedy", "Drama", "Sci-Fi", "Horror", "Fantasy", "Thriller", "Animation", "Documentary", "Romance", "Mystery", "War"];

export const allMedia: Media[] = [
  {
    id: '1',
    title: 'Galaxy Runners',
    description: 'In a distant future, a group of rogue pilots band together to smuggle goods and evade the clutches of the Galactic Federation. Their latest mission could change the fate of the universe.',
    posterPath: getImage('poster-1'),
    backdropPath: getImage('backdrop-1'),
    genres: ['Sci-Fi', 'Action', 'Adventure'],
    type: 'movie',
    releaseYear: 2023,
    rating: 8.5,
    cast: [
      { name: 'Alex Ray', character: 'Jax', profilePath: getImage('profile-1') },
      { name: 'Zoe Vance', character: 'Kira', profilePath: getImage('profile-2') },
      { name: 'Leo Drake', character: 'Commander Thorne', profilePath: getImage('profile-3') },
    ],
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: '2',
    title: 'Midnight City',
    description: 'A retired detective is pulled back into the criminal underworld when a mysterious new kingpin threatens to take over his city. He must confront his past to save its future.',
    posterPath: getImage('poster-2'),
    backdropPath: getImage('backdrop-2'),
    genres: ['Action', 'Thriller', 'Drama'],
    type: 'tv',
    releaseYear: 2022,
    rating: 9.1,
    cast: [
      { name: 'Markus Shaw', character: 'Detective Stone', profilePath: getImage('profile-4') },
      { name: 'Eva Rostova', character: 'The Ghost', profilePath: getImage('profile-2') },
    ],
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: '3',
    title: 'The Last Laugh',
    description: 'Two rival comedians are forced to go on a cross-country road trip together. Along the way, they discover that they have more in common than just a punchline.',
    posterPath: getImage('poster-3'),
    backdropPath: getImage('backdrop-3'),
    genres: ['Comedy'],
    type: 'movie',
    releaseYear: 2024,
    rating: 7.8,
    cast: [
      { name: 'Sammy Sparkle', character: 'Barry', profilePath: getImage('profile-1') },
      { name: 'Jenna Jokes', character: 'Larry', profilePath: getImage('profile-2') },
    ],
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: '4',
    title: 'Echoes of Time',
    description: 'A historian discovers a time-traveling device and must navigate different eras to fix a critical mistake that threatens to unravel the fabric of history.',
    posterPath: getImage('poster-4'),
    backdropPath: getImage('backdrop-4'),
    genres: ['Drama', 'Sci-Fi', 'History'],
    type: 'tv',
    releaseYear: 2023,
    rating: 8.8,
    cast: [
      { name: 'Dr. Aris Thorne', character: 'Dr. Aris Thorne', profilePath: getImage('profile-3') },
      { name: 'Clara Oswald', character: 'Clara Oswald', profilePath: getImage('profile-2') },
    ],
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: '5',
    title: 'The Shadow in the Attic',
    description: 'A family moves into a new home, only to discover a malevolent presence lurking in the attic. They must uncover the house\'s dark secrets before it\'s too late.',
    posterPath: getImage('poster-5'),
    backdropPath: getImage('backdrop-5'),
    genres: ['Horror', 'Mystery', 'Thriller'],
    type: 'movie',
    releaseYear: 2022,
    rating: 7.2,
    cast: [
      { name: 'John Smith', character: 'John Smith', profilePath: getImage('profile-1') },
      { name: 'Jane Smith', character: 'Jane Smith', profilePath: getImage('profile-2') },
    ],
  },
  {
    id: '6',
    title: 'Chronicles of Eldoria',
    description: 'In a land of myth and magic, a young farmhand discovers she is the last of a powerful line of dragon riders. She must embrace her destiny to save her kingdom from an ancient evil.',
    posterPath: getImage('poster-6'),
    backdropPath: getImage('backdrop-6'),
    genres: ['Fantasy', 'Adventure', 'Action'],
    type: 'tv',
    releaseYear: 2024,
    rating: 9.5,
    cast: [
      { name: 'Lyra', character: 'Lyra', profilePath: getImage('profile-2') },
      { name: 'Kael', character: 'Kael', profilePath: getImage('profile-1') },
    ],
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
    {
    id: '7',
    title: 'Project Chimera',
    description: 'A top-secret government experiment goes wrong, unleashing a genetically engineered creature on the world. A team of specialists must hunt it down before it multiplies.',
    posterPath: getImage('poster-7'),
    backdropPath: getImage('backdrop-2'),
    genres: ['Thriller', 'Sci-Fi', 'Action'],
    type: 'movie',
    releaseYear: 2023,
    rating: 7.9,
    cast: [],
  },
  {
    id: '8',
    title: 'Planet Pals',
    description: 'Join a group of quirky alien friends as they travel the galaxy, learning about different planets and cultures in a series of fun-filled animated adventures.',
    posterPath: getImage('poster-8'),
    backdropPath: getImage('backdrop-3'),
    genres: ['Animation', 'Family', 'Comedy'],
    type: 'tv',
    releaseYear: 2021,
    rating: 8.1,
    cast: [],
  },
  {
    id: '9',
    title: 'The Wild Frontier',
    description: 'An in-depth look at the most remote and untamed corners of the planet, showcasing the breathtaking beauty and harsh realities of life in the wild.',
    posterPath: getImage('poster-9'),
    backdropPath: getImage('backdrop-4'),
    genres: ['Documentary', 'Nature'],
    type: 'tv',
    releaseYear: 2023,
    rating: 9.4,
    cast: [],
  },
  {
    id: '10',
    title: 'Parisian Summer',
    description: 'An aspiring artist and a cynical journalist unexpectedly find love over a summer in Paris, but their different life paths threaten to pull them apart.',
    posterPath: getImage('poster-10'),
    backdropPath: getImage('backdrop-1'),
    genres: ['Romance', 'Drama'],
    type: 'movie',
    releaseYear: 2022,
    rating: 7.5,
    cast: [],
  },
  {
    id: '11',
    title: 'The Silent Witness',
    description: 'When a wealthy philanthropist is murdered, a detective with a photographic memory must piece together the clues from a single glance at the crime scene.',
    posterPath: getImage('poster-11'),
    backdropPath: getImage('backdrop-5'),
    genres: ['Mystery', 'Crime', 'Thriller'],
    type: 'movie',
    releaseYear: 2024,
    rating: 8.3,
    cast: [],
  },
  {
    id: '12',
    title: 'Fields of Valor',
    description: 'The epic story of a platoon of soldiers during a pivotal and brutal battle, highlighting their courage, sacrifice, and the bonds of brotherhood.',
    posterPath: getImage('poster-12'),
    backdropPath: getImage('backdrop-2'),
    genres: ['War', 'Drama', 'History'],
    type: 'movie',
    releaseYear: 2021,
    rating: 8.9,
    cast: [],
  },
];

export const trending = allMedia.filter(m => [1,2,6,3,5].includes(Number(m.id)));
export const newReleases = allMedia.filter(m => [3,6,11].includes(Number(m.id)));
export const watchlist = allMedia.filter(m => [4,7,8,10,12].includes(Number(m.id)));

export const viewingHistory: ViewingHistoryItem[] = [
    { title: 'Galaxy Runners', type: 'movie', genres: ['Sci-Fi', 'Action', 'Adventure'] },
    { title: 'Echoes of Time', type: 'tv', genres: ['Drama', 'Sci-Fi', 'History'] },
    { title: 'Project Chimera', type: 'movie', genres: ['Thriller', 'Sci-Fi', 'Action'] }
];
