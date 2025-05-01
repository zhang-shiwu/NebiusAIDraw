export interface GenerationResult {
  b64_json?: string;
  url?: string;
  error?: string;
  details?: any;
}

export interface GenerationState {
  isGenerating: boolean;
  result: GenerationResult | null;
  error: string | null;
}

export type ModelType = 'black-forest-labs/flux-schnell' | 'black-forest-labs/flux-dev';

export type ResponseFormatType = 'url' | 'b64_json';

export type OutputFormatType = 'png' | 'jpg' | 'webp';