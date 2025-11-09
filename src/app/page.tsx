import SearchContainer from '@/components/search-container';
import { Bot } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground font-headline">
                WikiSense
              </h1>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <SearchContainer />
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        Powered by Wikipedia and Google Genkit.
      </footer>
    </div>
  );
}
