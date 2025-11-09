'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefObject } from 'react';

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
          <span className="animate-spin mr-2">...</span> Searching...
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
  return (
    <form ref={formRef} action={formAction} className="flex gap-2 items-center">
      <Input
        ref={inputRef}
        type="search"
        name="query"
        placeholder="Search for topics on Wikipedia..."
        className="flex-grow text-base"
        required
        disabled={isPending}
      />
      <SubmitButton isPending={isPending} />
    </form>
  );
}
