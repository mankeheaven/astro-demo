import universalStore from '../stores/universalStore.js';

/**
 * 原生JavaScript组件 - 跨框架状态共享演示
 */
export class UniversalStateVanilla {
  constructor(container) {
    this.container = container;
    this.state = universalStore.getState();
    this.unsubscribe = null;
    
    this.init();
  }
  
  init() {
    // 设置用户
    universalStore.setUser('Vanilla用户', 'Vanilla');
    
    // 订阅状态变化
    this.unsubscribe = universalStore.subscribe((newState) => {
      this.state = newState;
      this.render();
    });
    
    // 初始渲染
    this.render();
  }
  
  render() {
    const { sharedCounter, sharedMessages, currentUser, theme, lastUpdated } = this.state;
    
    this.container.innerHTML = `
      <div class="p-6 rounded-lg shadow-lg border-2 border-yellow-200 ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-yellow-50 text-gray-800'
      }">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold text-yellow-600">
            🟡 Vanilla JS 组件
          </h2>
          <span class="text-sm opacity-75">
            最后更新: ${new Date(lastUpdated).toLocaleTimeString()}
          </span>
        </div>
        
        <!-- 用户信息 -->
        <div class="mb-6 p-4 bg-white dark:bg-gray-700 rounded-lg">
          <h3 class="font-semibold mb-2">当前用户信息</h3>
          <p>姓名: <span class="font-mono">${currentUser.name}</span></p>
          <p>框架: <span class="font-mono">${currentUser.framework}</span></p>
          
          <div class="mt-3 flex gap-2">
            <input
              id="vanilla-user-input"
              type="text"
              placeholder="输入新用户名"
              class="flex-1 px-3 py-1 border rounded text-black"
            />
            <button
              id="vanilla-set-user-btn"
              class="px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              设置
            </button>
          </div>
        </div>
        
        <!-- 共享计数器 -->
        <div class="mb-6 p-4 bg-white dark:bg-gray-700 rounded-lg">
          <h3 class="font-semibold mb-3">共享计数器</h3>
          <div class="text-center">
            <div class="text-4xl font-bold mb-4 text-yellow-600">
              ${sharedCounter}
            </div>
            <div class="flex justify-center gap-2">
              <button
                id="vanilla-decrement-btn"
                class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                -1
              </button>
              <button
                id="vanilla-reset-btn"
                class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                重置
              </button>
              <button
                id="vanilla-increment-btn"
                class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                +1
              </button>
            </div>
          </div>
        </div>
        
        <!-- 消息系统 -->
        <div class="mb-6 p-4 bg-white dark:bg-gray-700 rounded-lg">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-semibold">共享消息</h3>
            <button
              id="vanilla-clear-messages-btn"
              class="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
            >
              清除
            </button>
          </div>
          
          <div class="mb-3 flex gap-2">
            <input
              id="vanilla-message-input"
              type="text"
              placeholder="输入消息"
              class="flex-1 px-3 py-1 border rounded text-black"
            />
            <button
              id="vanilla-send-message-btn"
              class="px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              发送
            </button>
          </div>
          
          <div class="max-h-40 overflow-y-auto border rounded p-2 bg-gray-50 dark:bg-gray-600">
            ${sharedMessages.length > 0 ? `
              <ul class="space-y-1">
                ${sharedMessages.map(msg => `
                  <li class="text-sm">
                    <span class="text-gray-500">[${msg.timestamp}]</span>
                    <span class="ml-1 px-1 rounded text-xs ${
                      msg.framework === 'React' ? 'bg-blue-200 text-blue-800' :
                      msg.framework === 'Vue' ? 'bg-green-200 text-green-800' :
                      msg.framework === 'Vanilla' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-gray-200 text-gray-800'
                    }">
                      ${msg.framework}
                    </span>
                    <span class="ml-2">${msg.text}</span>
                  </li>
                `).join('')}
              </ul>
            ` : `
              <p class="text-gray-500 text-center italic">暂无消息</p>
            `}
          </div>
        </div>
        
        <!-- 主题切换 -->
        <div class="p-4 bg-white dark:bg-gray-700 rounded-lg">
          <div class="flex justify-between items-center">
            <span class="font-semibold">当前主题: ${theme}</span>
            <button
              id="vanilla-toggle-theme-btn"
              class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              切换主题
            </button>
          </div>
        </div>
      </div>
    `;
    
    // 绑定事件监听器
    this.bindEvents();
  }
  
  bindEvents() {
    // 计数器按钮
    const incrementBtn = this.container.querySelector('#vanilla-increment-btn');
    const decrementBtn = this.container.querySelector('#vanilla-decrement-btn');
    const resetBtn = this.container.querySelector('#vanilla-reset-btn');
    
    if (incrementBtn) incrementBtn.addEventListener('click', () => universalStore.incrementCounter());
    if (decrementBtn) decrementBtn.addEventListener('click', () => universalStore.decrementCounter());
    if (resetBtn) resetBtn.addEventListener('click', () => universalStore.resetCounter());
    
    // 用户设置
    const userInput = this.container.querySelector('#vanilla-user-input');
    const setUserBtn = this.container.querySelector('#vanilla-set-user-btn');
    
    const handleSetUser = () => {
      if (userInput && userInput.value.trim()) {
        universalStore.setUser(userInput.value.trim(), 'Vanilla');
        userInput.value = '';
      }
    };
    
    if (setUserBtn) setUserBtn.addEventListener('click', handleSetUser);
    if (userInput) {
      userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSetUser();
      });
    }
    
    // 消息系统
    const messageInput = this.container.querySelector('#vanilla-message-input');
    const sendMessageBtn = this.container.querySelector('#vanilla-send-message-btn');
    const clearMessagesBtn = this.container.querySelector('#vanilla-clear-messages-btn');
    
    const handleSendMessage = () => {
      if (messageInput && messageInput.value.trim()) {
        universalStore.addMessage(messageInput.value.trim(), 'Vanilla');
        messageInput.value = '';
      }
    };
    
    if (sendMessageBtn) sendMessageBtn.addEventListener('click', handleSendMessage);
    if (messageInput) {
      messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
      });
    }
    if (clearMessagesBtn) clearMessagesBtn.addEventListener('click', () => universalStore.clearMessages());
    
    // 主题切换
    const toggleThemeBtn = this.container.querySelector('#vanilla-toggle-theme-btn');
    if (toggleThemeBtn) toggleThemeBtn.addEventListener('click', () => universalStore.toggleTheme());
  }
  
  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

// 导出工厂函数，方便在HTML中使用
export function createUniversalStateVanilla(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return null;
  }
  
  return new UniversalStateVanilla(container);
} 