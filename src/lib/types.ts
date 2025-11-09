export type WikiSearchResult = {
  pageid: number;
  title: string;
  snippet: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
};

export type SearchState = {
  status: 'initial' | 'loading' | 'success' | 'error';
  message?: string;
  query?: string;
  results?: WikiSearchResult[];
  summary?: string;
  context?: string;
  relatedTopics?: string[];
};
