'use server';

import { z } from 'zod';
import { generateImage } from '@/ai/flows/generate-image-flow';
import type { ImageGenerationState } from './types';

const imageSchema = z.string().min(10, 'Prompt must be at least 10 characters long.');

export async function generateImageAction(
  prevState: ImageGenerationState,
  formData: FormData
): Promise<ImageGenerationState> {
  const prompt = formData.get('prompt');
  
  const validatedPrompt = imageSchema.safeParse(prompt);

  if (!validatedPrompt.success) {
    return {
      status: 'error',
      message: validatedPrompt.error.errors[0].message,
    };
  }

  const imagePrompt = validatedPrompt.data;

  try {
    const result = await generateImage({ prompt: imagePrompt });
    return {
      status: 'success',
      prompt: imagePrompt,
      image: result.image,
    };
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred during image generation.';
    return { status: 'error', message };
  }
}
