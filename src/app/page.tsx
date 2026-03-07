import { HeroSection } from '@/components/hero-section';
import { MediaCarousel } from '@/components/media-carousel';
import { RecommendationSection } from '@/components/recommendation-section';
import { trending, newReleases, watchlist } from '@/lib/data';

export default function HomePage() {
  const featuredContent = trending[0];

  return (
    <div className="flex flex-col">
      <HeroSection media={featuredContent} />
      <div className="container mx-auto flex flex-col gap-12 px-4 py-8 sm:px-6 sm:gap-16 lg:px-8">
        <MediaCarousel title="Trending Today" items={trending} />
        <RecommendationSection />
        <MediaCarousel title="My Watchlist" items={watchlist.slice(0, 5)} />
        <MediaCarousel title="New Releases" items={newReleases} />
      </div>
    </div>
  );
}
