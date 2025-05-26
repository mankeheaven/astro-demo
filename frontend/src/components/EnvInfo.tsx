import React from 'react';

// 声明全局变量类型
declare global {
  const __APP_ENV__: string;
  const __API_URL__: string;
  const __DEBUG__: boolean;
}

const EnvInfo: React.FC = () => {
  // 获取环境信息
  const appEnv = typeof __APP_ENV__ !== 'undefined' ? __APP_ENV__ : 'unknown';
  const apiUrl = typeof __API_URL__ !== 'undefined' ? __API_URL__ : 'unknown';
  const isDebug = typeof __DEBUG__ !== 'undefined' ? __DEBUG__ : false;

  // 环境颜色映射
  const getEnvColor = (env: string) => {
    switch (env) {
      case 'development':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'test':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'production':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg border">
      <h2 className="text-xl font-bold mb-4 text-gray-800">环境信息</h2>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">当前环境:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getEnvColor(appEnv)}`}>
            {appEnv}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600">API地址:</span>
          <span className="text-sm text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded">
            {apiUrl}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600">调试模式:</span>
          <span className={`px-2 py-1 rounded text-sm font-medium ${
            isDebug 
              ? 'bg-orange-100 text-orange-800' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {isDebug ? '开启' : '关闭'}
          </span>
        </div>
      </div>
      
      {isDebug && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded">
          <p className="text-orange-800 text-sm">
            🐛 调试模式已开启 - 这是开发环境特有的信息
          </p>
        </div>
      )}
    </div>
  );
};

export default EnvInfo; 