# 🌐 跨框架状态共享指南

## 概述

这个项目演示了如何在不同的前端框架（React、Vue、Vanilla JavaScript）之间共享全局状态。通过一个框架无关的状态管理器，实现了真正的跨框架状态同步。

## 🎯 核心特性

### ✨ 框架支持
- **React**: 使用自定义Hook集成
- **Vue**: 使用Composition API集成  
- **Vanilla JS**: 直接使用原生JavaScript
- **跨页面**: 支持不同页面间状态共享
- **跨标签页**: 使用localStorage实现标签页同步

### 🔧 技术特点
- **零依赖**: 核心状态管理器不依赖任何框架
- **类型安全**: 完整的TypeScript支持
- **持久化**: 自动保存到localStorage
- **响应式**: 发布-订阅模式实现实时更新
- **SSR友好**: 服务器端渲染兼容

## 📁 文件结构

```
src/
├── stores/
│   └── universalStore.js          # 核心状态管理器
├── hooks/
│   └── useUniversalStore.js       # React Hook适配器
├── components/
│   ├── UniversalStateReact.tsx    # React组件
│   ├── UniversalStateVue.vue      # Vue组件
│   └── UniversalStateVanilla.js   # Vanilla JS组件
└── pages/
    ├── cross-framework.astro      # Astro集成演示页面
    └── vanilla-demo.html          # 纯HTML演示页面
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install vue @astrojs/vue
```

### 2. 配置Astro

```javascript
// astro.config.mjs
import vue from '@astrojs/vue';

export default defineConfig({
  integrations: [tailwind(), react(), vue()],
  // ...其他配置
});
```

### 3. 使用状态管理器

#### React中使用

```tsx
import { useUniversalStore } from '../hooks/useUniversalStore.js';

function MyReactComponent() {
  const { sharedCounter, incrementCounter } = useUniversalStore();
  
  return (
    <div>
      <p>计数: {sharedCounter}</p>
      <button onClick={incrementCounter}>增加</button>
    </div>
  );
}
```

#### Vue中使用

```vue
<template>
  <div>
    <p>计数: {{ sharedCounter }}</p>
    <button @click="incrementCounter">增加</button>
  </div>
</template>

<script setup>
import { reactive, onMounted, onUnmounted } from 'vue';
import universalStore from '../stores/universalStore.js';

const state = reactive(universalStore.getState());
let unsubscribe = null;

onMounted(() => {
  unsubscribe = universalStore.subscribe((newState) => {
    Object.assign(state, newState);
  });
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});

const { sharedCounter } = state;
const incrementCounter = () => universalStore.incrementCounter();
</script>
```

#### Vanilla JS中使用

```javascript
import universalStore from '../stores/universalStore.js';

class MyComponent {
  constructor(container) {
    this.container = container;
    this.state = universalStore.getState();
    
    // 订阅状态变化
    this.unsubscribe = universalStore.subscribe((newState) => {
      this.state = newState;
      this.render();
    });
    
    this.render();
  }
  
  render() {
    this.container.innerHTML = `
      <div>
        <p>计数: ${this.state.sharedCounter}</p>
        <button id="increment">增加</button>
      </div>
    `;
    
    this.container.querySelector('#increment')
      .addEventListener('click', () => universalStore.incrementCounter());
  }
  
  destroy() {
    if (this.unsubscribe) this.unsubscribe();
  }
}
```

## 🔍 核心API

### UniversalStore类

#### 状态管理方法
```javascript
// 获取当前状态
const state = universalStore.getState();

// 更新状态
universalStore.setState({ key: value });

// 订阅状态变化
const unsubscribe = universalStore.subscribe((newState, oldState) => {
  console.log('状态更新:', newState);
});

// 取消订阅
unsubscribe();
```

#### 业务方法
```javascript
// 计数器操作
universalStore.incrementCounter();
universalStore.decrementCounter();
universalStore.resetCounter();

// 消息管理
universalStore.addMessage('消息内容', '框架名称');
universalStore.clearMessages();

// 用户管理
universalStore.setUser('用户名', '框架名称');

// 主题切换
universalStore.toggleTheme();
```

## 🎨 状态结构

```typescript
interface State {
  // 共享计数器
  sharedCounter: number;
  
  // 共享消息列表
  sharedMessages: Array<{
    id: number;
    text: string;
    framework: string;
    timestamp: string;
  }>;
  
  // 当前用户信息
  currentUser: {
    name: string;
    framework: string;
  };
  
  // 主题设置
  theme: 'light' | 'dark';
  
  // 最后更新时间
  lastUpdated: string;
}
```

## 🌟 高级特性

### 跨标签页同步

状态管理器自动监听`storage`事件，实现跨标签页的状态同步：

```javascript
window.addEventListener('storage', (e) => {
  if (e.key === 'universal-store') {
    this.loadFromStorage();
    this.notifySubscribers();
  }
});
```

### SSR兼容性

在服务器端渲染时，状态管理器会安全地处理localStorage访问：

```javascript
loadFromStorage() {
  if (typeof window === 'undefined') return;
  
  try {
    const stored = localStorage.getItem('universal-store');
    if (stored) {
      this.state = { ...this.state, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('加载状态失败:', error);
  }
}
```

### 错误处理

所有订阅者回调都有错误处理机制：

```javascript
notifySubscribers(oldState, newState) {
  this.subscribers.forEach(callback => {
    try {
      callback(newState || this.state, oldState);
    } catch (error) {
      console.error('订阅者回调执行错误:', error);
    }
  });
}
```

## 🧪 测试方法

### 1. 同页面测试
访问 `/cross-framework` 页面，在任意组件中修改状态，观察其他组件的实时更新。

### 2. 跨页面测试
1. 在 `/cross-framework` 页面修改状态
2. 访问 `/vanilla-demo.html` 页面
3. 观察状态是否保持一致

### 3. 跨标签页测试
1. 在两个标签页中打开同一页面
2. 在其中一个标签页修改状态
3. 观察另一个标签页是否同步更新

## 🔧 自定义扩展

### 添加新的状态字段

```javascript
// 在UniversalStore构造函数中添加
this.state = {
  // ...现有状态
  customField: 'default value'
};

// 添加对应的操作方法
setCustomField(value) {
  this.setState({ customField: value });
}
```

### 创建新的框架适配器

```javascript
// 例如：Angular适配器
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import universalStore from '../stores/universalStore.js';

@Injectable()
export class UniversalStoreService {
  private stateSubject = new BehaviorSubject(universalStore.getState());
  public state$ = this.stateSubject.asObservable();
  
  constructor() {
    universalStore.subscribe((newState) => {
      this.stateSubject.next(newState);
    });
  }
  
  incrementCounter() {
    universalStore.incrementCounter();
  }
  
  // ...其他方法
}
```

## 🚀 部署注意事项

1. **构建优化**: 状态管理器会被所有框架共享，确保只打包一次
2. **缓存策略**: localStorage数据在用户清除浏览器数据时会丢失
3. **版本兼容**: 状态结构变更时需要考虑向后兼容性

## 🤝 最佳实践

1. **状态设计**: 保持状态结构简单，避免深层嵌套
2. **性能优化**: 大量数据时考虑分页或虚拟滚动
3. **错误处理**: 始终为异步操作添加错误处理
4. **类型安全**: 使用TypeScript定义完整的类型
5. **测试覆盖**: 为状态管理器编写单元测试

## 📚 相关资源

- [Astro官方文档](https://docs.astro.build/)
- [React官方文档](https://react.dev/)
- [Vue官方文档](https://vuejs.org/)
- [发布-订阅模式](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)

---

这个跨框架状态共享方案为微前端架构、渐进式迁移和多框架共存提供了强大的支持。通过统一的状态管理，不同技术栈的团队可以无缝协作，共享数据和状态。 