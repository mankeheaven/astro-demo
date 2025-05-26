import React, { useState, useEffect } from 'react';
import { useUniversalStore } from '../hooks/useUniversalStore.js';

// 定义消息类型
interface Message {
  id: number;
  text: string;
  framework: string;
  timestamp: string;
}

const UniversalStateReact: React.FC = () => {
  const {
    sharedCounter,
    sharedMessages,
    currentUser,
    theme,
    lastUpdated,
    incrementCounter,
    decrementCounter,
    resetCounter,
    addMessage,
    clearMessages,
    setUser,
    toggleTheme
  } = useUniversalStore();
  
  const [userName, setUserName] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // 标记为客户端环境
    setIsClient(true);
    
    // 只在客户端设置用户
    setUser('React用户');
  }, []); // 空依赖数组
  
  const handleSetUser = () => {
    if (userName.trim()) {
      setUser(userName.trim());
      setUserName('');
    }
  };
  
  const handleAddMessage = () => {
    if (customMessage.trim()) {
      addMessage(customMessage.trim());
      setCustomMessage('');
    }
  };
  
  // 类型安全的消息数组
  const messages = (sharedMessages as Message[]) || [];
  
  return (
    <div className={`p-6 rounded-lg shadow-lg border-2 border-blue-200 ${
      theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-blue-50 text-gray-800'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-blue-600">
          🔵 React 组件
        </h2>
        <span className="text-sm opacity-75">
          {/* 只在客户端显示时间，避免SSR水合错误 */}
          {isClient ? `最后更新: ${new Date(lastUpdated).toLocaleTimeString()}` : '加载中...'}
        </span>
      </div>
      
      {/* 用户信息 */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-lg">
        <h3 className="font-semibold mb-2">当前用户信息</h3>
        <p>姓名: <span className="font-mono">{currentUser.name}</span></p>
        <p>框架: <span className="font-mono">{currentUser.framework}</span></p>
        
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="输入新用户名"
            className="flex-1 px-3 py-1 border rounded text-black"
            onKeyPress={(e) => e.key === 'Enter' && handleSetUser()}
          />
          <button
            onClick={handleSetUser}
            className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            设置
          </button>
        </div>
      </div>
      
      {/* 共享计数器 */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-lg">
        <h3 className="font-semibold mb-3">共享计数器</h3>
        <div className="text-center">
          <div className="text-4xl font-bold mb-4 text-blue-600">
            {sharedCounter}
          </div>
          <div className="flex justify-center gap-2">
            <button
              onClick={decrementCounter}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              -1
            </button>
            <button
              onClick={resetCounter}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              重置
            </button>
            <button
              onClick={incrementCounter}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              +1
            </button>
          </div>
        </div>
      </div>
      
      {/* 消息系统 */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">共享消息</h3>
          <button
            onClick={clearMessages}
            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
          >
            清除
          </button>
        </div>
        
        <div className="mb-3 flex gap-2">
          <input
            type="text"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="输入消息"
            className="flex-1 px-3 py-1 border rounded text-black"
            onKeyPress={(e) => e.key === 'Enter' && handleAddMessage()}
          />
          <button
            onClick={handleAddMessage}
            className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            发送
          </button>
        </div>
        
        <div className="max-h-40 overflow-y-auto border rounded p-2 bg-gray-50 dark:bg-gray-600">
          {messages.length > 0 ? (
            <ul className="space-y-1">
              {messages.map((msg) => (
                <li key={msg.id} className="text-sm">
                  <span className="text-gray-500">[{msg.timestamp}]</span>
                  <span className={`ml-1 px-1 rounded text-xs ${
                    msg.framework === 'React' ? 'bg-blue-200 text-blue-800' :
                    msg.framework === 'Vue' ? 'bg-green-200 text-green-800' :
                    msg.framework === 'Vanilla' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-gray-200 text-gray-800'
                  }`}>
                    {msg.framework}
                  </span>
                  <span className="ml-2">{msg.text}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center italic">暂无消息</p>
          )}
        </div>
      </div>
      
      {/* 主题切换 */}
      <div className="p-4 bg-white dark:bg-gray-700 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-semibold">当前主题: {theme}</span>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            切换主题
          </button>
        </div>
      </div>
    </div>
  );
};

export default UniversalStateReact; 