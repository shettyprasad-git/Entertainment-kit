import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import type { Media } from '@/types';
import { WatchlistButton } from '@/components/watchlist-button';
import { Badge } from '@/components/ui/badge';

type MediaCardProps = {
  media: Media;
};

export function MediaCard({ media }: MediaCardProps) {
  return (
    <Link href={`/media/${media.id}`} className="group relative block w-full overflow-hidden rounded-lg">
      <Image
        src={media.posterPath}
        alt={`Poster for ${media.title}`}
        width={500}
        height={750}
        className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
        data-ai-hint="movie poster"
      />
      {media.reason && (
        <Badge className="absolute top-2 left-2 z-20" variant="destructive">AI Pick</Badge>
      )}
      <div className="absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="p-4 text-white">
          <h3 className="font-bold truncate">{media.title}</h3>
          <div className="text-xs text-gray-300 flex items-center gap-2 mt-1">
            <span>{media.releaseYear}</span>
            <span>⭐ {media.rating}</span>
          </div>
          {media.reason && (
            <p className="text-xs text-gray-400 mt-2 line-clamp-2 italic">
              &quot;{media.reason}&quot;
            </p>
          )}
          <div className="mt-4 flex items-center justify-between">
            <button
              className="flex items-center gap-2 rounded-full bg-primary p-2 text-xs font-bold text-primary-foreground"
              aria-label={`Play ${media.title}`}
            >
              <Play className="h-4 w-4 fill-current" />
            </button>
            <WatchlistButton mediaId={media.id} />
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </Link>
  );
}
