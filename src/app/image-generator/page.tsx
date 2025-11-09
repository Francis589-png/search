'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Image as ImageIcon, Loader, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateImageAction } from './actions';
import type { ImageGenerationState } from './types';
import Image from 'next/image';

const initialState: ImageGenerationState = {
  status: 'initial',
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Generate Image
        </>
      )}
    </Button>
  );
}

export default function ImageGeneratorPage() {
  const [state, formAction] = useActionState(generateImageAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.status === 'error' && state.message) {
      toast({
        variant: 'destructive',
        title: 'Generation Error',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-primary" />
              <span>AI Image Generator</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <Input
                name="prompt"
                placeholder="e.g., A majestic dragon soaring over a mystical forest at dawn."
                required
                className="text-base"
                disabled={state.status === 'loading'}
              />
              <SubmitButton />
            </form>
          </CardContent>
        </Card>

        <div className="mt-8">
          {state.status === 'loading' && (
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <Loader className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-lg font-semibold">
                  Generating your image...
                </p>
                <p className="text-muted-foreground">
                  This may take a moment. Please be patient.
                </p>
              </CardContent>
            </Card>
          )}

          {state.status === 'success' && state.image && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video">
                  <Image
                    src={state.image}
                    alt={state.prompt || 'Generated image'}
                    fill
                    className="w-full rounded-md object-contain"
                  />
                </div>
                 <p className="text-sm text-muted-foreground mt-2">Prompt: {state.prompt}</p>
              </CardContent>
            </Card>
          )}
          
          {state.status === 'initial' && (
             <Alert>
                <Wand2 className="h-4 w-4" />
                <AlertTitle>Ready to create?</AlertTitle>
                <AlertDescription>
                Enter a description of the image you want to generate and click the button.
                </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
