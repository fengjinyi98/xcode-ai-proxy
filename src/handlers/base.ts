import { Request, Response } from 'express';
import { ConfigManager } from '../config';
import { ChatCompletionRequest, ErrorResponse } from '../types';

export abstract class BaseHandler {
  protected config = ConfigManager.getInstance();

  abstract handle(req: Request, res: Response): Promise<void>;

  protected validateRequest(req: Request): ChatCompletionRequest {
    const { model, messages } = req.body;

    if (!model) {
      throw new Error('缺少必需参数: model');
    }

    if (!messages || !Array.isArray(messages)) {
      throw new Error('缺少必需参数: messages 或格式无效');
    }

    return req.body as ChatCompletionRequest;
  }

  protected sendError(res: Response, status: number, message: string, type: string = 'request_error'): void {
    if (!res.headersSent) {
      const errorResponse: ErrorResponse = {
        error: {
          message,
          type
        }
      };
      res.status(status).json(errorResponse);
    }
  }

  protected logModelRequest(model: string, isStream: boolean = false): void {
    console.log('🎯 请求模型:', model);
    console.log('🔍 是否流式:', isStream);
  }
}