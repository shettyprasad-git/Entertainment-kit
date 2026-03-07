'use client';

import { useMemo } from 'react';
import { MediaCarousel } from '@/components/media-carousel';
import { allMedia } from '@/lib/data';
import type { Media } from '@/types';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function WatchlistPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const watchlistCollectionRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'userProfiles', user.uid, 'watchlists');
  }, [firestore, user]);

  const { data: watchlistItems, isLoading: isWatchlistLoading } = useCollection<{ contentId: string }>(watchlistCollectionRef);

  const userWatchlist = useMemo(() => {
    if (!watchlistItems) return [];
    return watchlistItems
      .map(item => allMedia.find(media => media.id === item.contentId))
      .filter((m): m is Media => m !== undefined);
  }, [watchlistItems]);

  if (isUserLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">My Watchlist</h1>
        <WatchlistSkeleton />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="mb-4 text-3xl font-bold tracking-tight">My Watchlist</h1>
        <p className="mb-4 text-muted-foreground">You need to be logged in to view your watchlist.</p>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">My Watchlist</h1>
      {isWatchlistLoading ? (
         <WatchlistSkeleton />
      ) : userWatchlist.length > 0 ? (
        <MediaCarousel title="" items={userWatchlist} />
      ) : (
        <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
          <p className="text-muted-foreground">Your watchlist is empty.</p>
        </div>
      )}
    </main>
  );
}

function WatchlistSkeleton() {
  return (
    <div className="flex space-x-2">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6">
          <Skeleton className="aspect-[2/3] w-full" />
        </div>
      ))}
    </div>
  );
}
