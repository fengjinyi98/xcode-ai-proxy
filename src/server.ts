import express from 'express';
import cors from 'cors';
import { ConfigManager } from './config';
import { ProxyHandler } from './handlers';
import { loggingMiddleware, errorHandler } from './middlewares';
import { getServerUrls } from './utils';

class XcodeAiProxyServer {
  private app: express.Application;
  private config: ConfigManager;
  private proxyHandler: ProxyHandler;

  constructor() {
    this.app = express();
    this.config = ConfigManager.getInstance();
    this.proxyHandler = new ProxyHandler();

    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(loggingMiddleware);
  }

  private setupRoutes(): void {
    // 健康检查
    this.app.get('/health', this.proxyHandler.handleHealth.bind(this.proxyHandler));

    // 模型列表
    this.app.get('/v1/models', this.proxyHandler.handleModels.bind(this.proxyHandler));

    // Chat completions - 支持多种路径格式
    this.app.post('/v1/chat/completions', this.proxyHandler.handle.bind(this.proxyHandler));
    this.app.post('/api/v1/chat/completions', this.proxyHandler.handle.bind(this.proxyHandler));
    this.app.post('/v1/messages', this.proxyHandler.handle.bind(this.proxyHandler));
  }

  private setupErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public start(): void {
    const appConfig = this.config.getAppConfig();

    this.app.listen(appConfig.port, appConfig.host, () => {
      this.logStartupInfo(appConfig);
    });
  }

  private logStartupInfo(appConfig: any): void {
    console.log('🚀 Xcode AI 代理服务已启动');

    const serverUrls = getServerUrls(appConfig.host, appConfig.port);
    console.log('📡 服务访问地址:');
    serverUrls.forEach((url, index) => {
      const label = index === 0 ? '本机访问' : index === 1 ? '局域网访问' : '其他网卡';
      console.log(`   ${label}: ${url}`);
    });

    console.log(`🎯 支持的模型:`);

    const modelConfigs = this.config.getModelConfigs();
    Object.entries(modelConfigs).forEach(([modelId, config]) => {
      console.log(`   - ${modelId} (${config.name || config.type})`);
    });

    console.log(`⚙️ 重试配置:`);
    console.log(`   最大重试次数: ${appConfig.maxRetries}`);
    console.log(`   重试延迟: ${appConfig.retryDelay}ms (递增)`);
    console.log(`   请求超时: ${appConfig.requestTimeout}ms`);

    console.log(`📋 配置 Xcode:`);
    console.log(`   ANTHROPIC_BASE_URL: ${serverUrls[1] || serverUrls[0]}`);
    console.log(`   ANTHROPIC_AUTH_TOKEN: any-string-works`);

    console.log('🔧 功能: API/CLI 统一代理，流式响应，动态配置，智能重试');

    this.config.logConfiguration();
  }
}

// 启动服务器
const server = new XcodeAiProxyServer();
server.start();