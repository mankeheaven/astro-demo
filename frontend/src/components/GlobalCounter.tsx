import React, { useEffect, useState } from 'react';
import useGlobalStore from '../stores/globalStore';

export default function GlobalCounter() {
  const { count, increment, decrement, reset, addMessage, setLastVisitedPage } = useGlobalStore();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      // 记录当前页面访问
      setLastVisitedPage(window.location.pathname);
      // 添加消息记录
      addMessage(`访问了计数器组件，当前计数: ${count}`);
    }
  }, [isClient, count, addMessage, setLastVisitedPage]);
  
  if (!isClient) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-16 bg-gray-200 rounded mb-6"></div>
          <div className="flex justify-center space-x-4">
            <div className="h-10 bg-gray-200 rounded w-20"></div>
            <div className="h-10 bg-gray-200 rounded w-20"></div>
            <div className="h-10 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">全局计数器</h2>
      
      <div className="text-center">
        <div className="text-5xl font-bold mb-6 dark:text-white">{count}</div>
        
        <div className="flex justify-center space-x-4">
          <button 
            onClick={decrement}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded"
          >
            减少
          </button>
          
          <button 
            onClick={increment}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
          >
            增加
          </button>
          
          <button 
            onClick={reset}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded"
          >
            重置
          </button>
        </div>
        
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          这个计数值存储在Zustand中，通过localStorage在所有页面间共享
        </p>
      </div>
    </div>
  );
} 