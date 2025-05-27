import React, { useState, useEffect } from 'react';
import { actions } from 'astro:actions';

interface SystemStats {
  cpuUsage: number;
  cpuCores: number;
  cpuModel: string;
  memoryUsed: number;
  memoryTotal: number;
  memoryUsagePercent: number;
  diskUsed: number;
  diskTotal: number;
  diskUsagePercent: number;
  networkReceived: number;
  networkSent: number;
  platform: string;
  arch: string;
  hostname: string;
  uptime: number;
  nodeVersion: string;
  totalUsers: number;
  totalTasks: number;
  enabledTasks: number;
  lastUpdate: string;
}

interface SystemMonitorProps {
  initialData: SystemStats;
}

export default function SystemMonitor({ initialData }: SystemMonitorProps) {
  const [data, setData] = useState<SystemStats>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());

  // 获取系统数据的函数
  const fetchSystemData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const systemStatsResult = await actions.getSystemStats();
      
      if (systemStatsResult.data?.success) {
        const stats = systemStatsResult.data.stats;
        
        // 获取数据库统计信息
        const dbStatsResult = await actions.statsGetDashboard();
        const dbStats = dbStatsResult.data?.success ? dbStatsResult.data.stats : null;
        
        const newData: SystemStats = {
          cpuUsage: stats.cpu.usage,
          cpuCores: stats.cpu.cores,
          cpuModel: stats.cpu.model,
          memoryUsed: stats.memory.used,
          memoryTotal: stats.memory.total,
          memoryUsagePercent: stats.memory.usagePercent,
          diskUsed: stats.disk.used,
          diskTotal: stats.disk.total,
          diskUsagePercent: stats.disk.usagePercent,
          networkReceived: stats.network.bytesReceived,
          networkSent: stats.network.bytesSent,
          platform: stats.system.platform,
          arch: stats.system.arch,
          hostname: stats.system.hostname,
          uptime: stats.system.uptime,
          nodeVersion: stats.system.nodeVersion,
          totalUsers: dbStats?.totalUsers || 0,
          totalTasks: dbStats?.totalTasks || 0,
          enabledTasks: dbStats?.enabledTasks || 0,
          lastUpdate: new Date(stats.timestamp).toLocaleString('zh-CN')
        };
        
        setData(newData);
        setLastUpdateTime(new Date());
      } else {
        setError('获取系统数据失败');
      }
    } catch (err) {
      console.error('获取系统统计信息失败:', err);
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  };

  // 设置定时器每3秒更新一次
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSystemData();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 手动刷新
  const handleManualRefresh = () => {
    fetchSystemData();
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 mt-10 p-6 rounded-lg shadow-lg border border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-purple-800 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2z"></path>
          </svg>
          实时系统监控仪表板
          {loading && (
            <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
          )}
        </h2>
        
        <div className="flex items-center space-x-2">
          {error && (
            <span className="text-red-600 text-sm">❌ {error}</span>
          )}
          <button
            onClick={handleManualRefresh}
            disabled={loading}
            className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span>刷新</span>
          </button>
        </div>
      </div>
      
      {/* 系统资源监控 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-blue-600">{data.cpuUsage.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">CPU 使用率</div>
          <div className="text-xs text-gray-500 mt-1">{data.cpuCores} 核心</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-green-600">{data.memoryUsagePercent.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">内存使用率</div>
          <div className="text-xs text-gray-500 mt-1">{data.memoryUsed.toFixed(1)}GB / {data.memoryTotal.toFixed(1)}GB</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-yellow-600">{data.diskUsagePercent.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">磁盘使用率</div>
          <div className="text-xs text-gray-500 mt-1">{data.diskUsed.toFixed(1)}GB / {data.diskTotal.toFixed(1)}GB</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-indigo-600">{(data.networkReceived + data.networkSent).toFixed(1)}MB</div>
          <div className="text-sm text-gray-600">网络流量</div>
          <div className="text-xs text-gray-500 mt-1">↓{data.networkReceived.toFixed(1)}MB ↑{data.networkSent.toFixed(1)}MB</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-orange-600">{data.totalUsers.toLocaleString()}</div>
          <div className="text-sm text-gray-600">数据库用户</div>
          <div className="text-xs text-gray-500 mt-1">{data.totalTasks} 个任务</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-red-600">{Math.floor(data.uptime / 3600)}h</div>
          <div className="text-sm text-gray-600">系统运行时间</div>
          <div className="text-xs text-gray-500 mt-1">{Math.floor((data.uptime % 3600) / 60)}m</div>
        </div>
      </div>

      {/* 系统详细信息 */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-800 mb-2">系统信息</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">主机名:</span>
              <span className="font-mono">{data.hostname}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">平台:</span>
              <span className="font-mono">{data.platform} ({data.arch})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Node.js:</span>
              <span className="font-mono">{data.nodeVersion}</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-800 mb-2">CPU 信息</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">型号:</span>
              <span className="font-mono text-xs">{data.cpuModel.substring(0, 30)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">核心数:</span>
              <span className="font-mono">{data.cpuCores}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">当前负载:</span>
              <span className="font-mono">{data.cpuUsage.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-3 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">最后更新:</span>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-purple-600">{data.lastUpdate}</span>
            <div className="flex items-center text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
              <span>自动更新中</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 