import Image from 'next/image';
import Link from 'next/link';
import { Play, Info, Star } from 'lucide-react';
import type { Media } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type HeroSectionProps = {
  media: Media;
};

export function HeroSection({ media }: HeroSectionProps) {
  return (
    <div className="relative h-[60vh] w-full md:h-[80vh]">
      <div className="absolute inset-0">
        <Image
          src={media.backdropPath}
          alt={`Backdrop for ${media.title}`}
          fill
          priority
          className="object-cover"
          data-ai-hint="dramatic landscape"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/10 to-transparent" />
      </div>
      <div className="relative z-10 flex h-full items-end p-4 md:items-center md:p-8 lg:p-12">
        <div className="flex w-full flex-col gap-6 md:w-1/2 lg:w-2/5">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
            {media.title}
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <Badge variant="outline">{media.type.toUpperCase()}</Badge>
            <span>{media.releaseYear}</span>
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span>{media.rating}/10</span>
            </div>
          </div>
          <p className="hidden text-sm text-muted-foreground md:line-clamp-3">
            {media.description}
          </p>
          <div className="flex items-center gap-4">
            <Button size="lg" asChild>
              <Link href={`/media/${media.id}`}>
                <Play className="mr-2 h-5 w-5 fill-current" /> Play
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-background/20 backdrop-blur-sm">
              <Link href={`/media/${media.id}`}>
                <Info className="mr-2 h-5 w-5" /> More Info
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
