# 🏝️ Astro 服务器群岛示例

这个项目展示了如何使用 `@astrojs/node` 适配器实现 Astro 5.0 的服务器群岛（Server Islands）功能。

## 📋 目录

- [什么是服务器群岛](#什么是服务器群岛)
- [配置说明](#配置说明)
- [示例组件](#示例组件)
- [运行项目](#运行项目)
- [API 端点](#api-端点)
- [最佳实践](#最佳实践)

## 🤔 什么是服务器群岛

服务器群岛是 Astro 5.0 的正式功能，它允许你在主要静态的页面中嵌入服务器端渲染的动态内容。这种架构结合了静态站点生成（SSG）的性能优势和服务器端渲染（SSR）的动态能力。

### 主要特性

- **混合渲染**: 在同一页面中结合静态和动态内容
- **按需渲染**: 只有标记为服务器群岛的组件才会在服务器端渲染
- **客户端水合**: 支持客户端交互和状态管理
- **性能优化**: 减少不必要的服务器端渲染开销
- **Fallback 支持**: 在动态内容加载时显示占位符内容

## ⚙️ 配置说明

### 1. 安装依赖

```bash
npm install @astrojs/node
```

### 2. 配置 astro.config.mjs

```javascript
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  adapter: node({
    mode: 'standalone'
  }),
  output: 'server',
  // 注意：在 Astro 5.0 中，服务器群岛是正式功能，无需实验性配置
});
```

### 3. 关键配置项说明

- `adapter: node()`: 使用 Node.js 适配器
- `output: 'server'`: 启用服务器端渲染模式
- **重要**: 在 Astro 5.0 中，服务器群岛已是正式功能，无需 `experimental.serverIslands` 配置

## 🧩 示例组件

### 基础服务器群岛组件

```astro
---
// src/components/ServerIslandDemo.astro
interface Props {
  title?: string;
  userId?: string;
}

const { title = "服务器群岛示例", userId } = Astro.props;

// 服务器端数据获取
async function fetchServerData() {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    serverTime: new Date().toLocaleString('zh-CN'),
    randomNumber: Math.floor(Math.random() * 1000),
    serverInfo: {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: Math.floor(process.uptime())
    }
  };
}

const serverData = await fetchServerData();
---

<div class="server-island">
  <h2>{title}</h2>
  <p>服务器时间: {serverData.serverTime}</p>
  <p>随机数: {serverData.randomNumber}</p>
  <p>Node.js 版本: {serverData.serverInfo.nodeVersion}</p>
</div>
```

### 交互式服务器群岛组件

```tsx
// src/components/InteractiveServerIsland.tsx
import { useState, useEffect } from 'react';

interface Props {
  initialData: {
    serverTime: string;
    randomNumber: number;
  };
}

export default function InteractiveServerIsland({ initialData }: Props) {
  const [counter, setCounter] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <div className="interactive-island">
      <h3>交互式服务器群岛</h3>
      <p>服务器时间: {initialData.serverTime}</p>
      <p>服务器随机数: {initialData.randomNumber}</p>
      <p>客户端计数器: {counter}</p>
      <button onClick={() => setCounter(prev => prev + 1)}>
        增加计数
      </button>
      <p>水合状态: {isHydrated ? '✅ 已水合' : '⏳ 水合中...'}</p>
    </div>
  );
}
```

### 在页面中使用服务器群岛

```astro
---
// src/pages/server-islands.astro
import Layout from '../layouts/Layout.astro';
import ServerIslandDemo from '../components/ServerIslandDemo.astro';
import InteractiveServerIsland from '../components/InteractiveServerIsland.tsx';

const interactiveData = {
  serverTime: new Date().toLocaleString('zh-CN'),
  randomNumber: Math.floor(Math.random() * 1000)
};
---

<Layout title="服务器群岛示例">
  <main>
    <!-- 使用 server:defer 指令创建服务器群岛 -->
    <ServerIslandDemo 
      title="基础示例" 
      server:defer
    >
      <!-- 添加 fallback 内容 -->
      <div slot="fallback" class="loading-placeholder">
        <p>正在加载服务器数据...</p>
      </div>
    </ServerIslandDemo>
    
    <!-- 交互式服务器群岛 -->
    <InteractiveServerIsland 
      initialData={interactiveData}
      client:load
    />
  </main>
</Layout>
```

### 关键指令说明

- `server:defer`: 将组件标记为服务器群岛，延迟渲染
- `slot="fallback"`: 在服务器群岛加载时显示的占位符内容
- `client:load`: 用于客户端交互组件的水合

## 🚀 运行项目

### 开发模式

```bash
cd frontend
npm run dev
```

### 构建和预览

```bash
# 构建项目
npm run build

# 预览构建结果
npm run preview
```

### 访问示例页面

- 主页: `http://localhost:3000/`
- 服务器群岛示例: `http://localhost:3000/server-islands`
- 带用户参数: `http://localhost:3000/server-islands?userId=123`

## 🔌 API 端点

项目包含一个动态 API 端点来演示服务器端数据获取：

### `/api/server-data`

支持以下查询参数：

- `type=general`: 获取通用服务器信息
- `type=dashboard`: 获取仪表板数据
- `type=user&userId=123`: 获取特定用户数据
- `type=system`: 获取系统信息

#### 示例请求

```bash
# 获取通用数据
curl http://localhost:3000/api/server-data?type=general

# 获取用户数据
curl http://localhost:3000/api/server-data?type=user&userId=123

# 获取仪表板数据
curl http://localhost:3000/api/server-data?type=dashboard
```

## 💡 最佳实践

### 1. 何时使用服务器群岛

- **动态内容**: 需要实时数据的组件
- **个性化内容**: 基于用户状态的内容
- **数据库查询**: 需要服务器端数据获取的组件
- **认证相关**: 需要服务器端验证的内容

### 2. 性能考虑

- **缓存策略**: 对服务器群岛的输出进行适当缓存
- **数据获取优化**: 避免在服务器群岛中进行重复的数据库查询
- **组件粒度**: 保持服务器群岛组件的适当大小
- **Fallback 内容**: 提供有意义的加载状态

### 3. 开发建议

- **错误处理**: 为服务器端数据获取添加错误处理
- **加载状态**: 为客户端交互提供加载状态
- **类型安全**: 使用 TypeScript 确保类型安全
- **Fallback 设计**: 设计美观的占位符内容

### 4. 部署注意事项

- **环境变量**: 确保生产环境中的环境变量正确配置
- **服务器资源**: 监控服务器群岛对资源使用的影响
- **缓存配置**: 在生产环境中配置适当的缓存策略

## 🔧 故障排除

### 常见问题

1. **服务器群岛不工作**
   - 确保使用 `server:defer` 指令
   - 检查 `output: 'server'` 配置
   - 验证 Node.js 适配器正确安装

2. **客户端交互不工作**
   - 确保使用了正确的客户端指令（如 `client:load`）
   - 检查组件是否正确导入
   - 验证 React/Vue 集成是否正确配置

3. **构建错误**
   - 检查所有依赖项是否正确安装
   - 验证 TypeScript 配置
   - 确保所有导入路径正确

4. **Fallback 内容不显示**
   - 确保使用了 `slot="fallback"` 属性
   - 检查 fallback 内容是否正确嵌套在服务器群岛组件中

## 🆕 Astro 5.0 更新

- **正式功能**: 服务器群岛现在是 Astro 的正式功能，无需实验性配置
- **更好的性能**: 改进的渲染性能和缓存策略
- **增强的 Fallback**: 更好的 fallback 内容支持
- **类型安全**: 改进的 TypeScript 支持

## 📚 相关资源

- [Astro 5.0 发布说明](https://astro.build/blog/astro-5/)
- [服务器群岛官方文档](https://docs.astro.build/en/guides/server-islands/)
- [Node.js 适配器文档](https://docs.astro.build/en/guides/integrations-guide/node/)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个示例项目！ 