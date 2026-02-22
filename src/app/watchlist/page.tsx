'use client';

import { MediaCarousel } from '@/components/media-carousel';
import { watchlist } from '@/lib/data';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function WatchlistPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  if (isUserLoading) {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold tracking-tight">My Watchlist</h1>
            <div>Loading...</div>
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
        {watchlist.length > 0 ? (
            <MediaCarousel title="" items={watchlist} />
        ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
                <p className="text-muted-foreground">Your watchlist is empty.</p>
            </div>
        )}
    </main>
  );
}
