'use client';

import { useFormStatus } from 'react-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchFormProps {
  formAction: (payload: FormData) => void;
  status: 'initial' | 'loading' | 'success' | 'error';
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="bg-accent hover:bg-accent/90 text-accent-foreground">
      {pending ? (
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

export default function SearchForm({ formAction, status }: SearchFormProps) {
  return (
    <form action={formAction} className="flex gap-2 items-center">
      <Input
        type="search"
        name="query"
        placeholder="Search for topics on Wikipedia..."
        className="flex-grow text-base"
        required
        disabled={status === 'loading'}
      />
      <SubmitButton />
    </form>
  );
}
