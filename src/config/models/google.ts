import { ApiModelConfig } from '../../types';
import { BaseModelProvider, ModelProviderConfig } from './base';

export class GoogleProvider extends BaseModelProvider {
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
      'gemini-pro': {
        type: 'api',
        apiUrl: this.config.apiUrl || 'https://generativelanguage.googleapis.com/v1beta',
        apiKey: this.config.apiKey!,
        provider: 'google',
        name: 'Gemini Pro',
        model: 'gemini-pro'
      }
    };
  }
}