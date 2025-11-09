'use server';

/**
 * @fileOverview A flow that analyzes search results and identifies key contextual information or related concepts.
 *
 * - contextualizeSearchResults - A function that handles the contextualization of search results.
 * - ContextualizeSearchResultsInput - The input type for the contextualizeSearchResults function.
 * - ContextualizeSearchResultsOutput - The return type for the contextualizeSearchResults function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContextualizeSearchResultsInputSchema = z.object({
  query: z.string().describe('The original search query.'),
  searchResults: z.string().describe('The search results to contextualize.'),
});
export type ContextualizeSearchResultsInput = z.infer<typeof ContextualizeSearchResultsInputSchema>;

const ContextualizeSearchResultsOutputSchema = z.object({
  contextualizedResults: z.string().describe('The contextualized search results.'),
});
export type ContextualizeSearchResultsOutput = z.infer<typeof ContextualizeSearchResultsOutputSchema>;

export async function contextualizeSearchResults(input: ContextualizeSearchResultsInput): Promise<ContextualizeSearchResultsOutput> {
  return contextualizeSearchResultsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contextualizeSearchResultsPrompt',
  input: {schema: ContextualizeSearchResultsInputSchema},
  output: {schema: ContextualizeSearchResultsOutputSchema},
  prompt: `You are an expert at providing context for search results.

  The user has searched for "{{query}}". Here are the search results:
  {{searchResults}}

  Identify key contextual information or related concepts to help the user gain a deeper understanding of the topic beyond the immediate search results. Return this information in a clear and concise manner.
  `,
});

const contextualizeSearchResultsFlow = ai.defineFlow(
  {
    name: 'contextualizeSearchResultsFlow',
    inputSchema: ContextualizeSearchResultsInputSchema,
    outputSchema: ContextualizeSearchResultsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
