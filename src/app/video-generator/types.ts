export type VideoGenerationState = {
    status: 'initial' | 'loading' | 'success' | 'error';
    message?: string;
    prompt?: string;
    video?: string;
};
