'use client';

import { useState } from 'react';
import { Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MediaCarousel } from '@/components/media-carousel';
import { viewingHistory, allMedia } from '@/lib/data';
import {
  aiPoweredRecommendations,
  type RecommendationOutput,
} from '@/ai/flows/ai-powered-recommendations-flow';
import type { Media } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from './ui/skeleton';

export function RecommendationSection() {
  const [recommendations, setRecommendations] = useState<Media[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result: RecommendationOutput = await aiPoweredRecommendations({ viewingHistory });
      
      const recommendedMedia = result.recommendations.map(rec => {
        const mediaDetails = allMedia.find(m => m.title.toLowerCase() === rec.title.toLowerCase());
        
        if (mediaDetails) {
          return {
            ...mediaDetails,
            reason: rec.reason,
          };
        }
        return null;
      }).filter((m): m is Media => m !== null);

      setRecommendations(recommendedMedia);
    } catch (e) {
      console.error(e);
      setError('Failed to get AI recommendations. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      {!recommendations && !isLoading && !error && (
        <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
          <h2 className="mb-2 text-2xl font-bold">Personalized For You</h2>
          <p className="mb-4 text-muted-foreground">
            Get AI-powered recommendations based on your viewing history.
          </p>
          <Button onClick={handleGetRecommendations}>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Recommendations
          </Button>
        </div>
      )}

      {isLoading && <RecommendationSkeleton />}

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {recommendations && (
        <MediaCarousel title="AI Recommendations For You" items={recommendations} />
      )}
    </section>
  );
}


function RecommendationSkeleton() {
    return (
        <section>
            <Skeleton className="h-8 w-64 mb-4" />
            <div className="flex space-x-2">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6">
                        <Skeleton className="aspect-[2/3] w-full" />
                    </div>
                ))}
            </div>
        </section>
    );
}
