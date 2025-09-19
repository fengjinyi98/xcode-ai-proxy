import { ApiModelConfig } from '../../types';
import { BaseModelProvider, ModelProviderConfig } from './base';

export class GeminiProvider extends BaseModelProvider {
  private config: ModelProviderConfig;

  constructor(config: ModelProviderConfig) {
    super();
    this.config = config;
  }

  isAvailable(): boolean {
    return !!(this.config.apiKey && this.config.enabled !== false);
  }

  getProviderName(): string {
    return 'google';
  }

  getModels(): Record<string, ApiModelConfig> {
    if (!this.isAvailable()) return {};

    return {
      'gemini-2.5-pro': {
        type: 'api',
        apiUrl: this.config.apiUrl || 'https://generativelanguage.googleapis.com/v1beta/openai',
        apiKey: this.config.apiKey!,
        provider: 'google',
        name: 'Gemini 2.5 Pro',
        model: 'gemini-2.5-pro'
      }
    };
  }
}