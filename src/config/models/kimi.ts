import { ApiModelConfig } from '../../types';
import { BaseModelProvider, ModelProviderConfig } from './base';

export class KimiProvider extends BaseModelProvider {
  private config: ModelProviderConfig;

  constructor(config: ModelProviderConfig) {
    super();
    this.config = config;
  }

  isAvailable(): boolean {
    return !!(this.config.apiKey && this.config.enabled !== false);
  }

  getProviderName(): string {
    return 'kimi';
  }

  getModels(): Record<string, ApiModelConfig> {
    if (!this.isAvailable()) return {};

    return {
      'kimi-k2-0905-preview': {
        type: 'api',
        apiUrl: this.config.apiUrl || 'https://api.moonshot.cn/v1',
        apiKey: this.config.apiKey!,
        provider: 'kimi',
        name: 'Kimi K2',
        model: 'moonshot-v1-8k'
      }
    };
  }
}