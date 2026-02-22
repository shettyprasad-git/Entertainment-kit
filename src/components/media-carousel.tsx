import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { MediaCard } from '@/components/media-card';
import type { Media } from '@/types';

type MediaCarouselProps = {
  title: string;
  items: Media[];
};

export function MediaCarousel({ title, items }: MediaCarouselProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold">{title}</h2>
      <Carousel
        opts={{
          align: 'start',
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2">
          {items.map((item, index) => (
            <CarouselItem
              key={item.id + '-' + index}
              className="basis-1/2 pl-2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
            >
              <MediaCard media={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden disabled:hidden sm:flex" />
        <CarouselNext className="hidden disabled:hidden sm:flex" />
      </Carousel>
    </section>
  );
}
