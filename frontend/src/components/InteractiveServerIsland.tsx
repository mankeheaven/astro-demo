import { useState, useEffect } from 'react';

interface Props {
  initialData: {
    serverTime: string;
    randomNumber: number;
  };
}

export default function InteractiveServerIsland({ initialData }: Props) {
  const [clientTime, setClientTime] = useState<string>('');
  const [counter, setCounter] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    setIsHydrated(true);
    updateClientTime();
    
    // 每秒更新客户端时间
    const interval = setInterval(updateClientTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const updateClientTime = () => {
    setClientTime(new Date().toLocaleString('zh-CN'));
  };

  const handleRefresh = async () => {
    setRefreshCount(prev => prev + 1);
    // 这里可以调用 API 获取新的服务器数据
    // 但在服务器群岛中，我们主要展示客户端交互
  };

  return (
    <div className="interactive-island bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg shadow-lg border border-green-200">
      <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
        交互式服务器群岛
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        {/* 服务器端数据 */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="font-semibold text-gray-800 mb-2">🖥️ 服务器端数据</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">服务器时间:</span>
              <span className="font-mono text-blue-600">{initialData.serverTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">服务器随机数:</span>
              <span className="font-mono text-purple-600">{initialData.randomNumber}</span>
            </div>
          </div>
        </div>

        {/* 客户端数据 */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="font-semibold text-gray-800 mb-2">💻 客户端数据</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">客户端时间:</span>
              <span className="font-mono text-green-600">
                {isHydrated ? clientTime : '加载中...'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">计数器:</span>
              <span className="font-mono text-orange-600">{counter}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">刷新次数:</span>
              <span className="font-mono text-red-600">{refreshCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 交互控件 */}
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={() => setCounter(prev => prev + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          增加计数
        </button>
        
        <button
          onClick={() => setCounter(0)}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          重置
        </button>
        
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          刷新数据
        </button>
      </div>

      {/* 状态指示器 */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-800">
            <strong>水合状态:</strong> {isHydrated ? '✅ 已水合' : '⏳ 水合中...'}
          </span>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isHydrated ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="text-xs text-gray-600">
              {isHydrated ? '客户端交互可用' : '等待客户端激活'}
            </span>
          </div>
        </div>
      </div>

      {/* 说明 */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>🏝️ 混合渲染:</strong> 此组件展示了服务器群岛的核心特性：
          服务器端数据在构建时生成，客户端交互在水合后可用。
        </p>
      </div>
    </div>
  );
} 