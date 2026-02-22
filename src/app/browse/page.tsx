import { allMedia, genres } from '@/lib/data';
import { BrowseClient } from '@/components/browse-client';
import { Suspense } from 'react';

export default function BrowsePage() {
  return (
    <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Suspense>
        <BrowseClient allMedia={allMedia} genres={genres} />
      </Suspense>
    </main>
  );
}
