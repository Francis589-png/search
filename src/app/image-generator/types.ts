export type ImageGenerationState = {
    status: 'initial' | 'loading' | 'success' | 'error';
    message?: string;
    prompt?: string;
    image?: string;
};
