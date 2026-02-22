import { notFound } from 'next/navigation';
import Image from 'next/image';
import { allMedia } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Play, Star, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { WatchlistButton } from '@/components/watchlist-button';
import { Separator } from '@/components/ui/separator';

type MediaPageProps = {
  params: {
    id: string;
  };
};

export async function generateStaticParams() {
  return allMedia.map((media) => ({
    id: media.id,
  }));
}

export default function MediaPage({ params }: MediaPageProps) {
  const media = allMedia.find((m) => m.id === params.id);

  if (!media) {
    notFound();
  }

  return (
    <>
      {/* Backdrop */}
      <div className="relative h-[40vh] w-full md:h-[50vh]">
        <Image
          src={media.backdropPath}
          alt={`Backdrop for ${media.title}`}
          fill
          priority
          className="object-cover opacity-30"
          data-ai-hint="dramatic landscape"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="container -mt-32 pb-16">
        <div className="relative z-10 flex flex-col gap-8 md:flex-row">
          {/* Poster */}
          <div className="w-full flex-shrink-0 md:w-64 lg:w-72">
            <Image
              src={media.posterPath}
              alt={`Poster for ${media.title}`}
              width={500}
              height={750}
              className="rounded-lg shadow-2xl"
              data-ai-hint="movie poster"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4 pt-8">
            <div className="flex items-center gap-4">
              {media.genres.map((genre) => (
                <Badge key={genre} variant="secondary">
                  {genre}
                </Badge>
              ))}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{media.title}</h1>
            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-400" />
                <span>{media.rating} / 10</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{media.releaseYear}</span>
              </div>
              <Badge variant="outline">{media.type.toUpperCase()}</Badge>
            </div>
            <p className="max-w-prose text-lg text-muted-foreground">{media.description}</p>
            <div className="flex items-center gap-4">
              <Button size="lg">
                <Play className="mr-2 h-5 w-5 fill-current" /> Play
              </Button>
              <WatchlistButton mediaId={media.id} />
            </div>
          </div>
        </div>

        <Separator className="my-12" />

        {/* Cast & Trailer */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {media.cast.length > 0 && (
            <div className="lg:col-span-2">
              <h2 className="mb-6 text-3xl font-bold">Cast</h2>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
                {media.cast.map((member) => (
                  <div key={member.name} className="flex flex-col items-center text-center">
                    <div className="relative h-32 w-24 overflow-hidden rounded-lg">
                      <Image
                        src={member.profilePath}
                        alt={member.name}
                        fill
                        className="object-cover"
                        data-ai-hint="actor headshot"
                      />
                    </div>
                    <p className="mt-2 font-semibold">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {media.trailerUrl && (
            <div>
              <h2 className="mb-6 text-3xl font-bold">Trailer</h2>
              <div className="aspect-video overflow-hidden rounded-lg">
                <iframe
                  src={media.trailerUrl}
                  title={`Trailer for ${media.title}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
