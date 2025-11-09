'use server';

import { z } from 'zod';
import { generateVideo } from '@/ai/flows/generate-video-flow';
import type { VideoGenerationState } from './types';

const videoSchema = z.string().min(10, 'Prompt must be at least 10 characters long.');

export async function generateVideoAction(
  prevState: VideoGenerationState,
  formData: FormData
): Promise<VideoGenerationState> {
  const prompt = formData.get('prompt');
  
  const validatedPrompt = videoSchema.safeParse(prompt);

  if (!validatedPrompt.success) {
    return {
      status: 'error',
      message: validatedPrompt.error.errors[0].message,
    };
  }

  const videoPrompt = validatedPrompt.data;

  try {
    const result = await generateVideo({ prompt: videoPrompt });
    return {
      status: 'success',
      prompt: videoPrompt,
      video: result.video,
    };
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred during video generation.';
    return { status: 'error', message };
  }
}
