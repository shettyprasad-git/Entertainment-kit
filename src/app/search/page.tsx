import { Suspense } from 'react';
import { allMedia } from '@/lib/data';
import { MediaCard } from '@/components/media-card';

function SearchResults({ query }: { query: string }) {
  const results = allMedia.filter(
    (media) =>
      media.title.toLowerCase().includes(query.toLowerCase()) ||
      media.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">
        Search results for &quot;{query}&quot;
      </h1>
      {results.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {results.map((media) => (
            <MediaCard key={media.id} media={media} />
          ))}
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
          <p className="text-muted-foreground">No results found for your search.</p>
        </div>
      )}
    </main>
  );
}

export default function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const query = searchParams?.q as string || '';

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults query={query} />
    </Suspense>
  );
}
