import { ApiModelConfig } from '../../types';

export abstract class BaseModelProvider {
  abstract getModels(): Record<string, ApiModelConfig>;
  abstract isAvailable(): boolean;
  abstract getProviderName(): string;
}

export interface ModelProviderConfig {
  apiKey?: string;
  apiUrl?: string;
  enabled?: boolean;
}