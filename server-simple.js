require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// 重试配置
const MAX_RETRIES = parseInt(process.env.MAX_RETRIES) || 3;
const RETRY_DELAY = parseInt(process.env.RETRY_DELAY) || 1000;
const REQUEST_TIMEOUT = parseInt(process.env.REQUEST_TIMEOUT) || 60000;

// 检查必需的环境变量
const requiredEnvVars = {
  ZHIPU_API_KEY: 'GLM-4.5 模型',
  KIMI_API_KEY: 'Kimi 模型'
};

for (const [envVar, modelName] of Object.entries(requiredEnvVars)) {
  if (!process.env[envVar]) {
    console.error(`❌ 缺少环境变量 ${envVar} (用于 ${modelName})`);
    console.error('请设置相应的环境变量后重新启动服务');
    process.exit(1);
  }
}

// API配置 - 直接在代码中配置，简单清晰
const API_CONFIGS = {
  'glm-4.5': {
    apiUrl: 'https://open.bigmodel.cn/api/paas/v4',
    apiKey: process.env.ZHIPU_API_KEY,
    type: 'zhipu',
    name: 'GLM-4.5'
  },
  'kimi-k2-0905-preview': {
    apiUrl: 'https://api.moonshot.cn/v1',
    apiKey: process.env.KIMI_API_KEY,
    type: 'kimi',
    name: 'Kimi K2'
  }
};

console.log('📋 已加载模型配置:');
Object.keys(API_CONFIGS).forEach(modelId => {
  const config = API_CONFIGS[modelId];
  console.log(`   - ${modelId} (${config.name})`);
});

// 通用重试函数
async function withRetry(operation, maxRetries = MAX_RETRIES, baseDelay = RETRY_DELAY) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 第${attempt}次尝试`);
      return await operation();
    } catch (error) {
      lastError = error;
      console.error(`❌ 第${attempt}次尝试失败:`, error.message);

      if (attempt < maxRetries) {
        const delay = baseDelay * attempt; // 递增延迟
        console.log(`⏳ ${delay}ms后重试...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  console.error(`❌ 所有${maxRetries}次重试都失败了`);
  throw lastError;
}

// 中间件
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// 日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 模型列表接口
app.get('/v1/models', (req, res) => {
  console.log('📋 返回模型列表');

  const modelList = Object.keys(API_CONFIGS).map(modelId => {
    const config = API_CONFIGS[modelId];
    return {
      id: modelId,
      object: 'model',
      created: 1677610602,
      owned_by: config.type,
      name: config.name || modelId
    };
  });

  res.json({
    object: 'list',
    data: modelList
  });
});

// 智谱API处理
async function handleZhipuRequest(requestBody, res) {
  console.log('📡 路由到智谱API');

  const operation = async () => {
    const config = API_CONFIGS['glm-4.5'];
    return await axios.post(
      `${config.apiUrl}/chat/completions`,
      { ...requestBody, model: 'glm-4.5' },
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        responseType: requestBody.stream ? 'stream' : 'json',
        timeout: REQUEST_TIMEOUT
      }
    );
  };

  const response = await withRetry(operation);
  console.log('✅ 智谱API响应状态:', response.status);
  res.set(response.headers);

  if (requestBody.stream) {
    console.log('🔄 透传智谱流式响应');
    response.data.pipe(res);
  } else {
    console.log('📦 返回智谱非流式响应');
    res.json(response.data);
  }
}

// Kimi API处理
async function handleKimiRequest(requestBody, res) {
  console.log('📡 路由到Kimi API');

  const operation = async () => {
    const config = API_CONFIGS['kimi-k2-0905-preview'];
    return await axios.post(
      `${config.apiUrl}/chat/completions`,
      { ...requestBody, model: 'kimi-k2-0905-preview' },
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        responseType: requestBody.stream ? 'stream' : 'json',
        timeout: REQUEST_TIMEOUT,
        httpsAgent: new (require('https')).Agent({
          keepAlive: true,
          timeout: REQUEST_TIMEOUT,
          rejectUnauthorized: true
        })
      }
    );
  };

  const response = await withRetry(operation);
  console.log('✅ Kimi API响应状态:', response.status);
  res.set(response.headers);

  if (requestBody.stream) {
    console.log('🔄 透传Kimi流式响应');
    response.data.pipe(res);
  } else {
    console.log('📦 返回Kimi非流式响应');
    res.json(response.data);
  }
}

// 代理处理函数
async function handleProxy(req, res) {
  try {
    const model = req.body.model;
    console.log('🎯 请求模型:', model);
    console.log('🔍 是否流式:', req.body.stream);

    if (!model || !API_CONFIGS[model]) {
      return res.status(400).json({
        error: {
          message: `不支持的模型: ${model}。支持的模型: ${Object.keys(API_CONFIGS).join(', ')}`,
          type: 'invalid_request_error'
        }
      });
    }

    const config = API_CONFIGS[model];

    if (config.type === 'zhipu') {
      await handleZhipuRequest(req.body, res);
    } else if (config.type === 'kimi') {
      await handleKimiRequest(req.body, res);
    }

  } catch (error) {
    console.error('❌ 代理请求失败:', error.message);
    if (!res.headersSent) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({
          error: {
            message: error.message,
            type: 'proxy_error'
          }
        });
      }
    }
  }
}

// 所有chat completions路径都使用代理处理器
app.post('/v1/chat/completions', handleProxy);
app.post('/api/v1/chat/completions', handleProxy);
app.post('/v1/messages', handleProxy);

// 启动服务器
app.listen(PORT, HOST, () => {
  console.log('🚀 Xcode AI 代理服务已启动');
  console.log(`📡 监听地址: http://${HOST}:${PORT}`);
  console.log(`🎯 支持的模型:`);
  Object.keys(API_CONFIGS).forEach(model => {
    const config = API_CONFIGS[model];
    console.log(`   - ${model} (${config.name || config.type})`);
  });
  console.log(`⚙️ 重试配置:`);
  console.log(`   最大重试次数: ${MAX_RETRIES}`);
  console.log(`   重试延迟: ${RETRY_DELAY}ms (递增)`);
  console.log(`   请求超时: ${REQUEST_TIMEOUT}ms`);
  console.log(`📋 配置 Xcode:`);
  console.log(`   ANTHROPIC_BASE_URL: http://localhost:${PORT}`);
  console.log(`   ANTHROPIC_AUTH_TOKEN: any-string-works`);
  console.log('🔧 功能: 智谱/Kimi代理，流式响应，动态配置，智能重试');
});