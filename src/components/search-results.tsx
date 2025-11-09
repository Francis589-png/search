import Image from 'next/image';
import type { SearchState } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Lightbulb, BookOpen, Compass, Play, Pause, Loader } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useRef } from 'react';
import { getAudioForText } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';


interface SearchResultsProps {
  state: SearchState;
  onRelatedTopicClick: (topic: string) => void;
}

function SummaryCard({ summary }: { summary: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handlePlayPause = async () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }
    
    setIsGenerating(true);
    try {
      const result = await getAudioForText(summary);
      if (result.success && result.audio) {
        const audio = new Audio(result.audio);
        audioRef.current = audio;
        audio.play();
        setIsPlaying(true);
        audio.onended = () => setIsPlaying(false);
      } else {
        throw new Error(result.error || 'Failed to generate audio.');
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Audio Error',
        description: error instanceof Error ? error.message : 'Could not play audio.'
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Card className="bg-card flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-primary" />
          <span>AI Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-card-foreground/90 leading-relaxed">{summary}</p>
      </CardContent>
      <CardFooter>
          <Button
            onClick={handlePlayPause}
            disabled={isGenerating}
            size="sm"
            variant="outline"
            className="bg-accent/10 hover:bg-accent/20"
          >
            {isGenerating ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : isPlaying ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Listen
              </>
            )}
          </Button>
      </CardFooter>
    </Card>
  );
}


export default function SearchResults({ state, onRelatedTopicClick }: SearchResultsProps) {
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {state.summary && <SummaryCard summary={state.summary} />}
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
          {state.relatedTopics && state.relatedTopics.length > 0 && (
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Compass className="w-6 h-6 text-primary" />
                  <span>Related Topics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {state.relatedTopics.map((topic) => (
                  <Button
                    key={topic}
                    variant="outline"
                    size="sm"
                    onClick={() => onRelatedTopicClick(topic)}
                    className="bg-accent/10 hover:bg-accent/20"
                  >
                    {topic}
                  </Button>
                ))}
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
