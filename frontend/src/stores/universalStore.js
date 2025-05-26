/**
 * 通用全局状态管理器
 * 支持 Vue、React、原生JavaScript 等多种框架
 */

class UniversalStore {
  constructor() {
    this.state = {
      // 共享计数器
      sharedCounter: 0,
      // 共享消息列表
      sharedMessages: [],
      // 当前用户信息
      currentUser: {
        name: '匿名用户',
        framework: 'unknown'
      },
      // 主题设置
      theme: 'light',
      // 最后更新时间
      lastUpdated: new Date().toISOString()
    };
    
    // 订阅者列表
    this.subscribers = new Set();
    
    // 从localStorage加载状态
    this.loadFromStorage();
    
    // 监听storage事件，实现跨标签页同步
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'universal-store') {
          this.loadFromStorage();
          this.notifySubscribers();
        }
      });
    }
    
    console.log('🔧 UniversalStore 初始化完成');
  }
  
  /**
   * 获取当前状态
   */
  getState() {
    return { ...this.state };
  }
  
  /**
   * 更新状态
   */
  setState(updates) {
    const oldState = { ...this.state };
    this.state = {
      ...this.state,
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    
    // 保存到localStorage
    this.saveToStorage();
    
    // 通知所有订阅者
    this.notifySubscribers(oldState, this.state);
  }
  
  /**
   * 订阅状态变化
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    
    // 返回取消订阅函数
    return () => {
      this.subscribers.delete(callback);
    };
  }
  
  /**
   * 通知所有订阅者
   */
  notifySubscribers(oldState = null, newState = null) {
    const currentState = newState || this.state;
    
    this.subscribers.forEach((callback) => {
      try {
        callback(currentState, oldState);
      } catch (error) {
        console.error('订阅者回调执行错误:', error);
      }
    });
  }
  
  /**
   * 从localStorage加载状态
   */
  loadFromStorage() {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem('universal-store');
      if (stored) {
        const parsedState = JSON.parse(stored);
        this.state = {
          ...this.state,
          ...parsedState
        };
      }
    } catch (error) {
      console.error('从localStorage加载状态失败:', error);
    }
  }
  
  /**
   * 保存状态到localStorage
   */
  saveToStorage() {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('universal-store', JSON.stringify(this.state));
    } catch (error) {
      console.error('保存状态到localStorage失败:', error);
    }
  }
  
  // === 业务方法 ===
  
  /**
   * 增加计数器
   */
  incrementCounter() {
    const newValue = this.state.sharedCounter + 1;
    this.setState({
      sharedCounter: newValue
    });
    this.addMessage(`计数器增加到 ${newValue}`);
  }
  
  /**
   * 减少计数器
   */
  decrementCounter() {
    const newValue = Math.max(0, this.state.sharedCounter - 1);
    this.setState({
      sharedCounter: newValue
    });
    this.addMessage(`计数器减少到 ${newValue}`);
  }
  
  /**
   * 重置计数器
   */
  resetCounter() {
    this.setState({
      sharedCounter: 0
    });
    this.addMessage('计数器已重置');
  }
  
  /**
   * 添加消息
   */
  addMessage(message, framework = 'unknown') {
    const newMessage = {
      id: Date.now() + Math.random(), // 确保唯一性
      text: message,
      framework: framework,
      timestamp: new Date().toLocaleTimeString()
    };
    
    this.setState({
      sharedMessages: [...this.state.sharedMessages, newMessage].slice(-10) // 只保留最近10条
    });
  }
  
  /**
   * 清除所有消息
   */
  clearMessages() {
    this.setState({
      sharedMessages: []
    });
  }
  
  /**
   * 设置用户信息
   */
  setUser(name, framework) {
    this.setState({
      currentUser: { name, framework }
    });
    this.addMessage(`用户 ${name} 从 ${framework} 框架加入`, framework);
  }
  
  /**
   * 切换主题
   */
  toggleTheme() {
    const newTheme = this.state.theme === 'light' ? 'dark' : 'light';
    this.setState({
      theme: newTheme
    });
    this.addMessage(`主题切换为 ${newTheme}`);
  }
}

// 创建全局实例
const universalStore = new UniversalStore();

// 导出实例和类
export default universalStore;
export { UniversalStore }; 