'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefObject, useState, useEffect, useCallback, useRef } from 'react';
import { getSearchSuggestions } from '@/app/actions';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';

interface SearchFormProps {
  formRef: RefObject<HTMLFormElement>;
  inputRef: RefObject<HTMLInputElement>;
  formAction: (payload: FormData) => void;
  isPending: boolean;
}

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button type="submit" disabled={isPending} className="bg-accent hover:bg-accent/90 text-accent-foreground">
      {isPending ? (
        <>
          <span className="animate-spin mr-2">
            <Loader />
          </span>{' '}
          Searching...
        </>
      ) : (
        <>
          <Search className="mr-2 h-4 w-4" /> Search
        </>
      )}
    </Button>
  );
}

export default function SearchForm({ formRef, inputRef, formAction, isPending }: SearchFormProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length > 1) {
        setIsFetchingSuggestions(true);
        const result = await getSearchSuggestions(debouncedQuery);
        setSuggestions(result);
        setIsFetchingSuggestions(false);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setActiveSuggestion(-1);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (inputRef.current) {
      inputRef.current.value = suggestion;
      setQuery(suggestion);
    }
    setShowSuggestions(false);
    formRef.current?.requestSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && activeSuggestion > -1) {
      e.preventDefault();
      handleSuggestionClick(suggestions[activeSuggestion]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    if (activeSuggestion > -1 && suggestionsRef.current) {
      const activeElement = suggestionsRef.current.children[activeSuggestion] as HTMLLIElement;
      activeElement?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeSuggestion]);

  return (
    <div className="relative w-full">
      <form ref={formRef} action={formAction} className="flex gap-2 items-start">
        <div className="flex-grow">
          <Input
            ref={inputRef}
            type="search"
            name="query"
            placeholder="Search for topics on Wikipedia..."
            className="flex-grow text-base"
            required
            disabled={isPending}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length > 1 && setShowSuggestions(true)}
            autoComplete="off"
          />
          {showSuggestions && (suggestions.length > 0 || isFetchingSuggestions) && (
            <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg">
               <ul ref={suggestionsRef} className="py-1">
                {isFetchingSuggestions && suggestions.length === 0 && (
                   <li className="px-3 py-2 text-sm text-muted-foreground flex items-center">
                     <Loader className="mr-2 h-4 w-4 animate-spin" />
                     Loading suggestions...
                   </li>
                )}
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className={cn(
                      "px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground",
                      index === activeSuggestion && "bg-accent text-accent-foreground"
                    )}
                    onMouseDown={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <SubmitButton isPending={isPending} />
      </form>
    </div>
  );
}
