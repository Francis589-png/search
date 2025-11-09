'use client';

import { useEffect, useActionState } from 'react';
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
  const [state, formAction] = useActionState(searchWikipedia, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.status === 'error' && state.message) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <SearchForm formAction={formAction} status={state.status} />
      </div>

      <div className="mt-12">
        {state.status === 'loading' && <LoadingSkeleton />}
        {state.status === 'success' && <SearchResults state={state} />}
        {state.status === 'initial' && (
          <div className="text-center text-muted-foreground py-16">
            <Sparkles className="mx-auto h-12 w-12 text-primary" />
            <h2 className="text-xl font-semibold">Welcome to WikiSense</h2>
            <p className="mt-2">
              Enter a topic above to start searching Wikipedia with AI summaries.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
