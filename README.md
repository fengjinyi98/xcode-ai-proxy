# Xcode AI Proxy

解决 Xcode 中无法直接添加智谱 GLM 和 Kimi 模型的问题。

## 解决什么问题？

当你在 Xcode 中尝试添加智谱或 Kimi AI 提供商时，会遇到：
- ❌ "Provider is not valid"
- ❌ "Models could not be fetched with the provided account details"

这个代理服务让你可以在 Xcode 中正常使用智谱 GLM-4.5 和 Kimi 模型。

## 使用方法

### 1. 配置 API 密钥

复制 `.env.example` 为 `.env`，填入你的 API 密钥：

```bash
# 智谱AI API 密钥 (从 https://open.bigmodel.cn/ 获取)
ZHIPU_API_KEY=你的智谱API密钥

# Kimi API 密钥 (从 https://platform.moonshot.cn/ 获取)
KIMI_API_KEY=你的Kimi API密钥
```

### 2. 启动服务

```bash
npm install
npm run dev
```

服务启动在 `http://localhost:3000`

### 3. 配置 Xcode

在 Xcode 中添加 AI 提供商：
- **Base URL**: `http://localhost:3000`
- **Auth Token**: `any-string-works` (任意字符串)

现在可以在 Xcode 中正常使用智谱 GLM-4.5 和 Kimi 模型了！

## 支持的模型

- `glm-4.5` - 智谱AI GLM-4.5
- `kimi-k2-0905-preview` - Kimi K2

## 常见问题

**Q: 服务启动失败？**
A: 检查是否正确设置了 API 密钥，确保 3000 端口未被占用

**Q: Xcode 还是连不上？**
A: 确认服务正在运行，Base URL 填写正确：`http://localhost:3000`
