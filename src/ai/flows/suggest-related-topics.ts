'use server';

/**
 * @fileOverview A flow that suggests related topics based on search results.
 *
 * - suggestRelatedTopics - A function that suggests related topics.
 * - SuggestRelatedTopicsInput - The input type for the suggestRelatedTopics function.
 * - SuggestRelatedTopicsOutput - The return type for the suggestRelatedTopics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelatedTopicsInputSchema = z.object({
  query: z.string().describe('The original search query.'),
  searchResults: z.string().describe('The search results to use for generating related topics.'),
});
export type SuggestRelatedTopicsInput = z.infer<typeof SuggestRelatedTopicsInputSchema>;

const SuggestRelatedTopicsOutputSchema = z.object({
  topics: z.array(z.string()).describe('A list of suggested related topics.'),
});
export type SuggestRelatedTopicsOutput = z.infer<typeof SuggestRelatedTopicsOutputSchema>;

export async function suggestRelatedTopics(input: SuggestRelatedTopicsInput): Promise<SuggestRelatedTopicsOutput> {
  return suggestRelatedTopicsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelatedTopicsPrompt',
  input: {schema: SuggestRelatedTopicsInputSchema},
  output: {schema: SuggestRelatedTopicsOutputSchema},
  prompt: `Based on the search results for "{{query}}", suggest a few related topics that the user might be interested in exploring next. Provide only a list of topics.

  Search Results:
  {{searchResults}}
  `,
});

const suggestRelatedTopicsFlow = ai.defineFlow(
  {
    name: 'suggestRelatedTopicsFlow',
    inputSchema: SuggestRelatedTopicsInputSchema,
    outputSchema: SuggestRelatedTopicsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output || { topics: [] };
  }
);
