export type ModelType = 'api';

export interface BaseModelConfig {
  type: ModelType;
  name: string;
}

export interface ApiModelConfig extends BaseModelConfig {
  type: 'api';
  apiUrl: string;
  apiKey: string;
  provider: 'zhipu' | 'kimi' | 'google';
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export type ModelConfig = ApiModelConfig;

export interface ModelConfigs {
  [modelId: string]: ModelConfig;
}

export interface AppConfig {
  port: number;
  host: string;
  maxRetries: number;
  retryDelay: number;
  requestTimeout: number;
  customSystemPrompt?: string;
}

export interface EnvConfig {
  ZHIPU_API_KEY?: string;
  ZHIPU_API_URL?: string;
  KIMI_API_KEY?: string;
  KIMI_API_URL?: string;
  GEMINI_API_KEY?: string;
  GEMINI_API_URL?: string;
  CUSTOM_SYSTEM_PROMPT?: string;
  PORT?: string;
  HOST?: string;
  MAX_RETRIES?: string;
  RETRY_DELAY?: string;
  REQUEST_TIMEOUT?: string;
}