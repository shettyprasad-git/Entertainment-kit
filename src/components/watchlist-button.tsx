'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Check, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useRouter } from 'next/navigation';

export function WatchlistButton({ mediaId }: { mediaId: string }) {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const watchlistCollectionRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'userProfiles', user.uid, 'watchlists');
  }, [firestore, user]);

  const { data: watchlistItems, isLoading: isWatchlistLoading } = useCollection<{ contentId: string }>(watchlistCollectionRef);

  const watchlistItem = useMemo(() => 
    watchlistItems?.find(item => item.contentId === mediaId),
  [watchlistItems, mediaId]);

  const inWatchlist = !!watchlistItem;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to manage your watchlist.",
        variant: "destructive"
      });
      router.push('/login');
      return;
    }
    
    if (!firestore || !watchlistCollectionRef) return;

    if (inWatchlist && watchlistItem) {
      const docRef = doc(firestore, 'userProfiles', user.uid, 'watchlists', watchlistItem.id);
      deleteDocumentNonBlocking(docRef);
      toast({
        title: "Removed from Watchlist",
      });
    } else {
      addDocumentNonBlocking(watchlistCollectionRef, {
        contentId: mediaId,
        userId: user.uid,
        addedDate: new Date().toISOString(),
      });
      toast({
        title: "Added to Watchlist",
      });
    }
  };

  if (isWatchlistLoading && user) {
    return (
        <Button
            variant="ghost"
            size="icon"
            disabled
            className="rounded-full bg-white/10 text-white backdrop-blur-sm"
            aria-label="Loading watchlist status"
        >
            <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
      onClick={handleClick}
      aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      {inWatchlist ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
    </Button>
  );
}
