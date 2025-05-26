import { useState, useEffect } from 'react';
import universalStore from '../stores/universalStore.js';

/**
 * React Hook for Universal Store
 * 让React组件能够使用通用状态管理器
 */
export function useUniversalStore() {
  const [state, setState] = useState(() => universalStore.getState());
  
  useEffect(() => {
    // 订阅状态变化
    const unsubscribe = universalStore.subscribe((newState) => {
      setState(newState);
    });
    
    // 组件卸载时取消订阅
    return unsubscribe;
  }, []); // 空依赖数组，确保只在挂载时执行一次
  
  // 返回状态和操作方法
  return {
    // 状态
    ...state,
    
    // 操作方法
    incrementCounter: universalStore.incrementCounter.bind(universalStore),
    decrementCounter: universalStore.decrementCounter.bind(universalStore),
    resetCounter: universalStore.resetCounter.bind(universalStore),
    addMessage: (message) => universalStore.addMessage(message, 'React'),
    clearMessages: universalStore.clearMessages.bind(universalStore),
    setUser: (name) => universalStore.setUser(name, 'React'),
    toggleTheme: universalStore.toggleTheme.bind(universalStore),
  };
} 