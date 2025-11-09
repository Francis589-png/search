'use server';

import { z } from 'zod';
import type { SearchState, WikiSearchResult } from '@/lib/types';
import { summarizeSearchResults } from '@/ai/flows/summarize-search-results';
import { contextualizeSearchResults } from '@/ai/flows/contextualize-search-results';
import { suggestRelatedTopics } from '@/ai/flows/suggest-related-topics';
import { textToSpeech } from '@/ai/flows/text-to-speech';

const searchSchema = z.string().min(3, 'Search query must be at least 3 characters long.');

export async function searchWikipedia(
  prevState: SearchState,
  formData: FormData
): Promise<SearchState> {
  const query = formData.get('query');

  const validatedQuery = searchSchema.safeParse(query);

  if (!validatedQuery.success) {
    return {
      status: 'error',
      message: validatedQuery.error.errors[0].message,
    };
  }
  
  const searchQuery = validatedQuery.data;
  const headers = {
    'User-Agent': 'WikiSenseApp/1.0 (https://your-app-url.com; your-contact@example.com)'
  };

  try {
    // Step 1: Search for articles and get snippets
    const searchParams = new URLSearchParams({
      action: 'query',
      list: 'search',
      srsearch: searchQuery,
      srlimit: '6',
      srprop: 'snippet',
      format: 'json',
      origin: '*',
    });
    const searchResponse = await fetch(`https://en.wikipedia.org/w/api.php?${searchParams}`, { headers });
    if (!searchResponse.ok) throw new Error('Failed to fetch search results from Wikipedia.');
    
    const searchData = await searchResponse.json();
    if (!searchData.query?.search || searchData.query.search.length === 0) {
      return { status: 'success', query: searchQuery, results: [], summary: 'No results found for your query.', context: '', relatedTopics: [] };
    }

    const pageIds = searchData.query.search.map((item: any) => item.pageid);
    const snippets: Record<number, string> = searchData.query.search.reduce((acc: any, item: any) => {
        acc[item.pageid] = item.snippet;
        return acc;
    }, {});


    // Step 2: Get thumbnails for the found page IDs
    const imageParams = new URLSearchParams({
      action: 'query',
      pageids: pageIds.join('|'),
      prop: 'pageimages',
      piprop: 'thumbnail',
      pithumbsize: '200',
      format: 'json',
      origin: '*',
    });
    const imageResponse = await fetch(`https://en.wikipedia.org/w/api.php?${imageParams}`, { headers });
    if (!imageResponse.ok) throw new Error('Failed to fetch images from Wikipedia.');

    const imageData = await imageResponse.json();
    const pagesData = imageData.query?.pages || {};

    const results: WikiSearchResult[] = Object.values(pagesData).map((page: any) => ({
      pageid: page.pageid,
      title: page.title,
      snippet: snippets[page.pageid],
      thumbnail: page.thumbnail,
    }));

    // Step 3: Use Genkit to summarize, contextualize, and suggest related topics
    const searchResultsText = results.map(r => `Title: ${r.title}\nSnippet: ${r.snippet.replace(/<[^>]*>/g, '')}`).join('\n\n');

    const [summaryResult, contextResult, relatedTopicsResult] = await Promise.all([
      summarizeSearchResults({ query: searchQuery, searchResults: searchResultsText }),
      contextualizeSearchResults({ query: searchQuery, searchResults: searchResultsText }),
      suggestRelatedTopics({ query: searchQuery, searchResults: searchResultsText }),
    ]);

    return {
      status: 'success',
      query: searchQuery,
      results,
      summary: summaryResult.summary,
      context: contextResult.contextualizedResults,
      relatedTopics: relatedTopicsResult.topics,
    };

  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { status: 'error', message };
  }
}

export async function getAudioForText(text: string) {
  try {
    const { audio } = await textToSpeech(text);
    return { success: true, audio };
  } catch (error) {
    console.error('Error generating audio:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate audio.';
    return { success: false, error: message };
  }
}

export async function getSearchSuggestions(query: string): Promise<string[]> {
  if (query.length < 2) {
    return [];
  }

  const headers = {
    'User-Agent': 'WikiSenseApp/1.0 (https://your-app-url.com; your-contact@example.com)'
  };
  
  const searchParams = new URLSearchParams({
    action: 'opensearch',
    search: query,
    limit: '5',
    namespace: '0',
    format: 'json',
    origin: '*',
  });

  try {
    const response = await fetch(`https://en.wikipedia.org/w/api.php?${searchParams}`, { headers });
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    // The suggestions are in the second item of the response array
    return data[1] || [];
  } catch (error) {
    console.error('Failed to fetch suggestions:', error);
    return [];
  }
}
