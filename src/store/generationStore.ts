import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ModelType, ResponseFormatType, OutputFormatType } from '@/types/generation';

export interface GeneratedImage {
  id: string;
  prompt: string;
  negativePrompt: string;
  timestamp: number;
  imageData: string;
  parameters: {
    width: number;
    height: number;
    steps: number;
    seed: number;
    model: ModelType;
    fileFormat: OutputFormatType;
  };
}

interface GenerationStore {
  history: GeneratedImage[];
  defaultModel: ModelType;
  defaultResponseFormat: ResponseFormatType;
  defaultFileFormat: OutputFormatType;
  addToHistory: (image: GeneratedImage) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  setDefaultModel: (model: ModelType) => void;
  setDefaultResponseFormat: (format: ResponseFormatType) => void;
  setDefaultFileFormat: (format: OutputFormatType) => void;
}

export const useGenerationStore = create<GenerationStore>()(
  persist(
    (set) => ({
      history: [],
      defaultModel: 'black-forest-labs/flux-schnell',
      defaultResponseFormat: 'b64_json',
      defaultFileFormat: 'png',
      addToHistory: (image) => 
        set((state) => ({ 
          history: [image, ...state.history].slice(0, 50) // 限制保存50条历史记录
        })),
      removeFromHistory: (id) => 
        set((state) => ({ 
          history: state.history.filter(item => item.id !== id) 
        })),
      clearHistory: () => set({ history: [] }),
      setDefaultModel: (model) => set({ defaultModel: model }),
      setDefaultResponseFormat: (format) => set({ defaultResponseFormat: format }),
      setDefaultFileFormat: (format) => set({ defaultFileFormat: format }),
    }),
    {
      name: 'ai-image-generation-store',
    }
  )
);