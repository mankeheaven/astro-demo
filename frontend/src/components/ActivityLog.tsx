import React, { useState, useEffect } from 'react';
import useGlobalStore from '../stores/globalStore';

const ActivityLog: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  return <ActivityLogContent />;
};

const ActivityLogContent: React.FC = () => {
  const { messages, clearMessages, lastVisitedPage } = useGlobalStore();
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold dark:text-white">活动日志</h2>
        <button 
          onClick={clearMessages}
          className="bg-red-500 hover:bg-red-700 text-white text-sm py-1 px-3 rounded"
        >
          清除记录
        </button>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-600 dark:text-gray-300">
          最后访问页面: <span className="font-semibold">{lastVisitedPage || '无记录'}</span>
        </p>
      </div>
      
      <div className="border dark:border-gray-700 rounded-lg p-3 max-h-60 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        {messages.length > 0 ? (
          <ul className="space-y-1">
            {messages.map((message, index) => (
              <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                {message}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center italic">
            暂无活动记录
          </p>
        )}
      </div>
      
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        这些记录存储在Zustand中，通过localStorage在所有页面间共享
      </p>
    </div>
  );
};

export default ActivityLog; 