import React from 'react';
import { useUser } from '../contexts/UserContext';
import useGlobalStore from '../stores/globalStore';

export default function StateDisplay() {
  // 从UserContext获取数据
  const { username, theme, setTheme } = useUser();
  
  // 从GlobalStore获取数据
  const { 
    count, 
    increment, 
    lastVisitedPage, 
    messages,
    addMessage 
  } = useGlobalStore();
  
  // 记录当前页面访问
  React.useEffect(() => {
    // 添加消息记录
    addMessage(`访问了关于页面，使用了新布局`);
  }, [addMessage]);
  
  // 切换主题
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <div className="space-y-8">
      {/* UserContext数据 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">UserContext 数据</h2>
        <div className="space-y-2">
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-semibold">用户名:</span> {username}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-semibold">当前主题:</span> {theme}
          </p>
          
          <button
            onClick={toggleTheme}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            切换主题
          </button>
        </div>
      </div>
      
      {/* GlobalStore数据 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">GlobalStore 数据</h2>
        <div className="space-y-2">
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-semibold">计数器:</span> {count}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-semibold">最后访问页面:</span> {lastVisitedPage || '未记录'}
          </p>
          
          <div className="mt-4">
            <button
              onClick={increment}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              增加计数
            </button>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-semibold mb-2 dark:text-white">最近活动记录:</h3>
          <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded max-h-40 overflow-y-auto">
            {messages.length > 0 ? (
              <ul className="text-sm space-y-1">
                {messages.slice(-5).map((msg, idx) => (
                  <li key={idx} className="text-gray-600 dark:text-gray-400">{msg}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">暂无活动记录</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 