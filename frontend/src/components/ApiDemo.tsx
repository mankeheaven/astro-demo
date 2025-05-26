import React, { useState, useEffect } from 'react';
import { healthApi } from '../services/api';

interface HealthStatus {
  status: string;
  time?: string;
  error?: string;
}

export default function ApiDemo() {
  const [health, setHealth] = useState<HealthStatus>({ status: '加载中...' });
  const [loading, setLoading] = useState<boolean>(false);
  
  // 检查API健康状态
  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await healthApi.check();
      setHealth({
        status: response.status || '健康',
        time: new Date().toLocaleTimeString(),
      });
    } catch (error) {
      console.error('健康检查失败:', error);
      setHealth({
        status: '失败',
        time: new Date().toLocaleTimeString(),
        error: error instanceof Error ? error.message : '未知错误'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // 组件加载时检查一次健康状态
  useEffect(() => {
    checkHealth();
  }, []);
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">API 演示</h2>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700 dark:text-gray-300">API 健康状态:</span>
          <div className="flex items-center space-x-2">
            <span className={`inline-block w-3 h-3 rounded-full ${
              health.status === '健康' ? 'bg-green-500' : 
              health.status === '加载中...' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></span>
            <span className="font-medium dark:text-white">{health.status}</span>
          </div>
        </div>
        
        {health.time && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            上次检查时间: {health.time}
          </p>
        )}
        
        {health.error && (
          <p className="mt-2 text-red-600 dark:text-red-400">{health.error}</p>
        )}
      </div>
      
      <div className="flex justify-center">
        <button 
          onClick={checkHealth}
          disabled={loading}
          className={`
            px-4 py-2 rounded font-medium
            ${loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
            }
          `}
        >
          {loading ? '检查中...' : '检查API状态'}
        </button>
      </div>
    </div>
  );
} 