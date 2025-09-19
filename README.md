# Xcode AI Proxy

🚀 **专为 Xcode 设计的多模型 AI 代理服务**

解决 Xcode 中无法直接添加多个 AI 模型的问题，支持智谱 GLM、Kimi、Google Gemini 等主流模型。

## ✨ 特性

- 🎯 **多模型支持**: 智谱 GLM-4.5、Kimi K2、Google Gemini 2.5 Pro
- 🔄 **流式响应**: 完整支持 SSE 流式输出
- 🇨🇳 **中文优化**: 自动插入中文交流指令
- ⚙️ **自定义提示**: 支持用户自定义系统提示
- 🛡️ **智能重试**: 自动重试机制，提高稳定性
- 📦 **TypeScript**: 完全重构，类型安全
- 🔧 **模块化**: 清晰的代码架构，易于扩展

## 🔧 支持的模型

| 模型 | 提供商 | 模型 ID | 说明 |
|------|-------|---------|------|
| GLM-4.5 | 智谱AI | `glm-4.5` | 智谱最新大语言模型 |
| Kimi K2 | Moonshot | `kimi-k2-0905-preview` | Kimi 长文本模型 |
| Gemini 2.5 Pro | Google | `gemini-2.5-pro` | Google 最新多模态模型 |

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env`，配置你的 API 密钥：

```bash
# 智谱AI配置
ZHIPU_API_KEY=你的智谱API密钥
ZHIPU_API_URL=https://open.bigmodel.cn/api/paas/v4

# Kimi配置
KIMI_API_KEY=你的Kimi API密钥
KIMI_API_URL=https://api.moonshot.cn/v1

# Google Gemini配置
GEMINI_API_KEY=你的Gemini API密钥
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/openai

# 自定义系统提示（可选）
# CUSTOM_SYSTEM_PROMPT=你是一个专业的Swift开发助手，专门帮助iOS和macOS开发。

# 服务器配置
PORT=9988
HOST=0.0.0.0

# 重试配置
MAX_RETRIES=3
RETRY_DELAY=1000
REQUEST_TIMEOUT=60000
```

### 3. 启动服务

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build
npm start
```

### 4. 配置 Xcode

在 Xcode 中添加 AI 提供商：

- **Base URL**: `http://localhost:9988` （或你配置的端口）
- **Auth Token**: `any-string-works` （任意字符串即可）

🎉 现在可以在 Xcode 中使用所有支持的 AI 模型了！

## 📋 API 密钥获取

| 提供商 | 获取地址 | 说明 |
|--------|----------|------|
| 智谱AI | https://open.bigmodel.cn/ | 注册后在控制台获取 API Key |
| Kimi | https://platform.moonshot.cn/ | 注册后在 API 管理中获取 |
| Google Gemini | https://aistudio.google.com/app/apikey | 需要 Google 账号，可能需要梯子 |

## 🛠️ 配置说明

### 环境变量详解

- `PORT`: 服务运行端口，默认 9988
- `HOST`: 服务绑定地址，默认 0.0.0.0（所有接口）
- `MAX_RETRIES`: API 请求最大重试次数，默认 3
- `RETRY_DELAY`: 重试延迟基数（毫秒），默认 1000
- `REQUEST_TIMEOUT`: 请求超时时间（毫秒），默认 60000
- `CUSTOM_SYSTEM_PROMPT`: 自定义系统提示，会自动插入到对话中

### 网络访问

服务启动后会显示多个访问地址：
- `http://localhost:9988` - 本机访问
- `http://你的局域网IP:9988` - 局域网其他设备访问

## 🔍 故障排除

### 常见问题

**Q: 服务启动失败？**
- 检查 Node.js 版本（建议 16+）
- 确认端口未被占用
- 检查 `.env` 文件配置

**Q: Xcode 连接失败？**
- 确认服务正在运行
- 检查防火墙设置
- 确认 Base URL 正确

**Q: API 请求失败？**
- 检查 API 密钥是否正确
- 确认网络连接正常
- 查看控制台日志排查具体错误

**Q: 模型响应异常？**
- 检查模型 ID 是否正确
- 确认对应的 API 密钥已配置
- 查看服务日志获取详细信息

## 🏗️ 开发

### 项目结构

```
src/
├── config/          # 配置管理
│   ├── models/      # 模型配置（每个提供商一个文件）
│   └── config.ts    # 主配置管理器
├── handlers/        # 请求处理器
│   ├── base.ts      # 基础处理器
│   ├── api.ts       # API 请求处理
│   └── proxy.ts     # 代理请求处理
├── types/           # TypeScript 类型定义
├── utils/           # 工具函数
└── server.ts        # 服务器入口
```

### 添加新模型

1. 在 `src/config/models/` 创建新的提供商文件
2. 继承 `BaseModelProvider` 类
3. 在 `config.ts` 中注册新提供商
4. 更新环境变量类型定义

## 📄 更新日志

### v2.0.0 (2024-09-19)

- ✨ **重大重构**: 完全迁移到 TypeScript
- 🎯 **新增 Gemini 支持**: 使用官方 OpenAI 兼容端点
- 🏗️ **模块化架构**: 每个模型提供商独立配置文件
- 🇨🇳 **中文优化**: 自动插入中文交流指令
- ⚙️ **自定义提示**: 支持用户自定义系统提示
- 🔧 **配置优化**: 统一的环境变量管理
- 🛡️ **错误处理**: 改进的错误处理和重试机制
- 📦 **性能优化**: 移除复杂的格式转换，提升响应速度

### v1.0.0

- 🎯 基础功能：支持智谱 GLM-4.5 和 Kimi 模型
- 🔄 流式响应支持
- ⚙️ 基础配置管理

## 📜 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**注意**: 请妥善保管你的 API 密钥，不要提交到版本控制系统中。
