# 🚀 服务器群岛快速开始指南

## 什么是服务器群岛？

服务器群岛是 Astro 5.0 的正式功能，允许你在静态页面中嵌入动态的服务器端渲染内容。

## 快速配置

### 1. 安装依赖
```bash
npm install @astrojs/node
```

### 2. 配置 Astro
```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  adapter: node({ mode: 'standalone' }),
  output: 'server'
});
```

### 3. 创建服务器群岛组件
```astro
---
// src/components/DynamicContent.astro
const data = await fetch('https://api.example.com/data');
const result = await data.json();
---

<div>
  <h2>动态内容</h2>
  <p>当前时间: {new Date().toLocaleString()}</p>
  <p>数据: {result.message}</p>
</div>
```

### 4. 在页面中使用
```astro
---
// src/pages/index.astro
import DynamicContent from '../components/DynamicContent.astro';
---

<html>
<body>
  <h1>我的网站</h1>
  
  <!-- 静态内容 -->
  <p>这是静态内容，会立即显示</p>
  
  <!-- 服务器群岛 -->
  <DynamicContent server:defer>
    <div slot="fallback">
      <p>正在加载动态内容...</p>
    </div>
  </DynamicContent>
</body>
</html>
```

## 关键概念

- **`server:defer`**: 将组件标记为服务器群岛
- **`slot="fallback"`**: 加载时显示的占位符内容
- **混合渲染**: 静态内容立即显示，动态内容异步加载

## 运行示例

```bash
npm run dev
```

访问 `http://localhost:3000/server-islands` 查看完整示例。

## 优势

✅ **性能**: 静态内容立即显示  
✅ **SEO**: 主要内容可被搜索引擎索引  
✅ **用户体验**: 渐进式加载，无需等待所有内容  
✅ **缓存**: 静态部分可以被 CDN 缓存  

## 适用场景

- 用户个性化内容
- 实时数据展示
- 需要认证的内容
- 第三方 API 数据

更多详细信息请查看 [SERVER-ISLANDS-README.md](./SERVER-ISLANDS-README.md)。 