import { ApiModelConfig } from '../../types';
import { BaseModelProvider, ModelProviderConfig } from './base';

export class ZhipuProvider extends BaseModelProvider {
  private config: ModelProviderConfig;

  constructor(config: ModelProviderConfig) {
    super();
    this.config = config;
  }

  isAvailable(): boolean {
    return !!(this.config.apiKey && this.config.enabled !== false);
  }

  getProviderName(): string {
    return 'zhipu';
  }

  getModels(): Record<string, ApiModelConfig> {
    if (!this.isAvailable()) return {};

    return {
      'glm-4.5': {
        type: 'api',
        apiUrl: this.config.apiUrl || 'https://open.bigmodel.cn/api/paas/v4',
        apiKey: this.config.apiKey!,
        provider: 'zhipu',
        name: 'GLM-4.5',
        model: 'glm-4-0520'
      }
    };
  }
}