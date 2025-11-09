import Image from 'next/image';
import type { SearchState } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Lightbulb, BookOpen } from 'lucide-react';

export default function SearchResults({ state }: { state: SearchState }) {
  const noImagePlaceholder = PlaceHolderImages[0];

  if (!state.query || state.results === undefined) {
    return null;
  }
  
  if (state.results.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold">No results for &quot;{state.query}&quot;</h2>
        <p className="text-muted-foreground mt-2">Try searching for something else.</p>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-6">
          Results for &quot;{state.query}&quot;
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {state.summary && (
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-primary" />
                  <span>AI Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-card-foreground/90 leading-relaxed">{state.summary}</p>
              </CardContent>
            </Card>
          )}
          {state.context && (
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-primary" />
                  <span>Deeper Context</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-card-foreground/90 leading-relaxed">{state.context}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold tracking-tight mb-6">
          Wikipedia Articles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.results.map((result) => (
            <a
              key={result.pageid}
              href={`https://en.wikipedia.org/?curid=${result.pageid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:scale-[1.02] transition-transform duration-200"
            >
              <Card className="h-full flex flex-col overflow-hidden">
                <div className="relative w-full h-40">
                  <Image
                    src={result.thumbnail?.source || noImagePlaceholder.imageUrl}
                    alt={result.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    data-ai-hint={result.thumbnail ? undefined : noImagePlaceholder.imageHint}
                  />
                </div>
                <CardHeader>
                  <CardTitle>{result.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription
                    dangerouslySetInnerHTML={{ __html: result.snippet + '...' }}
                    className="leading-snug"
                  />
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
