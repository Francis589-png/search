'use server';

/**
 * @fileOverview A flow for converting text to speech.
 *
 * - textToSpeech - A function that converts text to speech.
 */
import {
  TextToSpeechInput,
  TextToSpeechOutput,
} from './text-to-speech-types';
import { textToSpeechFlow } from './text-to-speech.server';


export async function textToSpeech(
  input: TextToSpeechInput
): Promise<TextToSpeechOutput> {
  return textToSpeechFlow(input);
}
