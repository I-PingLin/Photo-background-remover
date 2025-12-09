export interface ProcessedImage {
  originalUrl: string;
  originalMimeType: string;
  generatedUrl: string | null;
  promptUsed: string;
  timestamp: number;
}

export enum AppStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface QuickAction {
  label: string;
  prompt: string;
  icon: string;
}
