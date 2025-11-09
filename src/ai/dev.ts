'use server';
/**
 * @fileoverview This file is the development entry point for Genkit.
 *
 * It is used to register all the flows that are available in the application.
 */
import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-search-results.ts';
import '@/ai/flows/contextualize-search-results.ts';
import '@/ai/flows/suggest-related-topics.ts';
import '@/ai/flows/text-to-speech.ts';
