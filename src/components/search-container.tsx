'use client';

import { useEffect, useActionState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { SearchState } from '@/lib/types';
import { searchWikipedia } from '@/app/actions';
import SearchForm from '@/components/search-form';
import SearchResults from '@/components/search-results';
import LoadingSkeleton from './loading-skeleton';
import { Sparkles } from 'lucide-react';

const initialState: SearchState = {
  status: 'initial',
};

export default function SearchContainer() {
  const [state, formAction, isPending] = useActionState(searchWikipedia, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.status === 'error' && state.message) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast]);

  const handleRelatedTopicSearch = (topic: string) => {
    if (inputRef.current && formRef.current) {
      inputRef.current.value = topic;
      formRef.current.requestSubmit();
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <SearchForm formRef={formRef} inputRef={inputRef} formAction={formAction} isPending={isPending} />
      </div>

      <div className="mt-12">
        {isPending && <LoadingSkeleton />}
        {state.status === 'success' && <SearchResults state={state} onRelatedTopicClick={handleRelatedTopicSearch} />}
        {state.status === 'initial' && !isPending && (
          <div className="text-center text-muted-foreground py-16">
            <Sparkles className="mx-auto h-12 w-12 text-primary" />
            <h2 className="text-xl font-semibold">Welcome to JTT Search</h2>
            <p className="mt-2">
              Enter a topic above to start searching Wikipedia with AI summaries.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
