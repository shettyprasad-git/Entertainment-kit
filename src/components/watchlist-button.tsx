'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export function WatchlistButton({ mediaId }: { mediaId: string }) {
  const [inWatchlist, setInWatchlist] = useState(false);
  const { toast } = useToast();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newWatchlistStatus = !inWatchlist;
    setInWatchlist(newWatchlistStatus);

    toast({
      title: newWatchlistStatus ? "Added to Watchlist" : "Removed from Watchlist",
      description: `The item has been ${newWatchlistStatus ? 'added to' : 'removed from'} your watchlist.`,
    });
    // In a real app, you'd call a server action/API here
  };

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
