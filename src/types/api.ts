export interface ChatMessageContent {
  type: 'text';
  text: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | ChatMessageContent[];
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ModelInfo {
  id: string;
  object: string;
  created: number;
  owned_by: string;
  name?: string;
}

export interface ModelsResponse {
  object: string;
  data: ModelInfo[];
}

export interface ErrorResponse {
  error: {
    message: string;
    type: string;
    code?: string;
  };
}