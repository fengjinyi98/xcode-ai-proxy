import { Request, Response } from 'express';
import { BaseHandler } from './base';
import { ApiHandler } from './api';
import { ModelsResponse } from '../types';

export class ProxyHandler extends BaseHandler {
  private apiHandler = new ApiHandler();

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const requestBody = this.validateRequest(req);
      const model = requestBody.model;

      const modelConfig = this.config.getModelConfig(model);
      if (!modelConfig) {
        const supportedModels = this.config.getSupportedModels();
        this.sendError(
          res,
          400,
          `不支持的模型: ${model}。支持的模型: ${supportedModels.join(', ')}`,
          'invalid_request_error'
        );
        return;
      }

      // 所有模型都通过API处理器处理
      if (modelConfig.type === 'api') {
        await this.apiHandler.handle(req, res);
      } else {
        this.sendError(res, 500, `未知的模型类型: ${(modelConfig as any).type}`, 'internal_error');
      }

    } catch (error: any) {
      console.error('❌ 代理请求失败:', error.message);
      this.sendError(res, 500, error.message, 'proxy_error');
    }
  }

  handleModels(req: Request, res: Response): void {
    console.log('📋 返回模型列表');

    const modelConfigs = this.config.getModelConfigs();
    const modelList = Object.entries(modelConfigs).map(([modelId, config]) => ({
      id: modelId,
      object: 'model',
      created: 1677610602,
      owned_by: config.provider,
      name: config.name || modelId
    }));

    const response: ModelsResponse = {
      object: 'list',
      data: modelList
    };

    res.json(response);
  }

  handleHealth(req: Request, res: Response): void {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      models: this.config.getSupportedModels().length
    });
  }
}