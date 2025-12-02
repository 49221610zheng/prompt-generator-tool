# 提示词工具 - 企业级解决方案

## 项目概述

提示词工具是一个企业级的AI提示词生成与管理平台，提供智能化的提示词创建、优化、存储和共享功能。系统支持多种AI模型集成，包括OpenAI、Hugging Face和本地Ollama模型，为不同场景提供专业的提示词解决方案。

**核心功能特性**：
- 🤖 **智能提示词生成**：基于用户需求自动生成高质量提示词
- 📋 **模板管理**：创建、编辑、共享和重用提示词模板
- 🎙️ **语音转文本集成**：支持通过语音输入生成提示词
- 📊 **历史记录管理**：完整的操作历史跟踪和检索
- 🔒 **企业级安全**：JWT认证、API密钥、角色权限控制
- 🚦 **速率限制**：防止API滥用和DoS攻击
- 📈 **性能监控**：实时监控系统性能和API响应时间
- 🔄 **故障降级**：多数据库支持和本地模型回退机制
- 📝 **详细日志**：结构化日志和错误追踪

## 技术架构

### 前端技术栈
- **框架**：React.js
- **状态管理**：Redux + Redux Toolkit
- **UI组件库**：Ant Design
- **网络请求**：Axios
- **实时通信**：WebSocket

### 后端技术栈
- **运行环境**：Node.js + Express.js
- **数据库**：MongoDB（主）、MySQL（备选）、内存存储（降级方案）
- **认证授权**：JWT + API Key
- **缓存**：Redis
- **文件存储**：本地文件系统 + 云存储支持
- **日志管理**：结构化JSON日志 + 日志轮转

### AI模型集成
- **OpenAI**：GPT-3.5/4系列
- **Hugging Face**：开源LLM模型
- **Ollama**：本地运行的开源模型
- **百度AI**：语音识别服务

## 系统要求

### 开发环境
- **Node.js**：v16.x 或更高版本
- **npm**：v8.x 或更高版本
- **MongoDB**：v5.0+（可选）
- **Redis**：v6.0+（可选）
- **Ollama**：v0.1.10+（用于本地模型，可选）

### 生产环境
- **服务器**：2CPU核心，4GB内存，50GB存储
- **容器化**：支持Docker + Docker Compose
- **负载均衡**：支持Nginx反向代理
- **监控**：集成Prometheus + Grafana

## 安装与部署

### 1. 克隆代码库

```bash
git clone https://github.com/your-organization/prompt-generator.git
cd prompt-generator
```

### 2. 安装依赖

#### 后端依赖

```bash
cd prompt-generator-backend
npm install
```

#### 前端依赖

```bash
cd ../prompt-generator-frontend
npm install
```

### 3. 配置环境变量

复制示例配置文件并根据环境需求进行修改：

```bash
# 后端配置
cd prompt-generator-backend
cp .env.example .env
# 编辑.env文件配置必要的环境变量
```

### 4. 开发环境启动

#### 启动后端服务

```bash
cd prompt-generator-backend
npm run dev
```