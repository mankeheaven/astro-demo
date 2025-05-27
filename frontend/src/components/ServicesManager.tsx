// 服务管理组件
import React, { useState, useEffect } from 'react';
import { actions } from 'astro:actions';

interface Task {
  id: string;
  name: string;
  schedule: string;
  handler: string;
  enabled: boolean;
  lastRun?: Date;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

interface Service {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error';
  startTime?: Date;
  lastActivity?: Date;
  errorCount: number;
}

interface SystemMetrics {
  totalServices: number;
  runningServices: number;
  errorServices: number;
  totalErrors: number;
  uptime: number;
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
  timestamp: string;
}

export default function ServicesManager() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'services' | 'metrics'>('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 新任务表单
  const [newTask, setNewTask] = useState({
    name: '',
    schedule: '',
    handler: '',
    enabled: true
  });

  useEffect(() => {
    loadTasks();
    loadServices();
    loadMetrics();
    
    // 定期刷新数据
    const interval = setInterval(() => {
      if (activeTab === 'metrics') {
        loadMetrics();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeTab]);

  const loadTasks = async () => {
    try {
      const result = await actions.scheduler.getTasks();
      if (result.data) {
        setTasks(result.data);
      }
    } catch (error) {
      console.error('加载任务失败:', error);
    }
  };

  const loadServices = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setServices(data.services || []);
    } catch (error) {
      console.error('加载服务失败:', error);
    }
  };

  const loadMetrics = async () => {
    try {
      const response = await fetch('/api/metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('加载指标失败:', error);
    }
  };

  const toggleTask = async (taskId: string) => {
    setLoading(true);
    try {
      const result = await actions.scheduler.toggleTask({ taskId });
      if (result.data) {
        setMessage({ type: 'success', text: result.data.message });
        await loadTasks();
      }
    } catch (error) {
      setMessage({ type: 'error', text: '操作失败' });
    } finally {
      setLoading(false);
    }
  };

  const runTaskNow = async (taskId: string) => {
    setLoading(true);
    try {
      const result = await actions.scheduler.runTaskNow({ taskId });
      if (result.data) {
        setMessage({ type: 'success', text: result.data.message });
        await loadTasks();
      }
    } catch (error) {
      setMessage({ type: 'error', text: '执行失败' });
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await actions.scheduler.addTask(newTask);
      if (result.data) {
        setMessage({ type: 'success', text: result.data.message });
        setNewTask({ name: '', schedule: '', handler: '', enabled: true });
        await loadTasks();
      }
    } catch (error) {
      setMessage({ type: 'error', text: '添加失败' });
    } finally {
      setLoading(false);
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}天 ${hours}小时 ${minutes}分钟`;
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* 消息提示 */}
      {message && (
        <div className={`p-4 mb-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
          <button 
            onClick={() => setMessage(null)}
            className="float-right text-lg font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* 标签页导航 */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { key: 'tasks', label: '⏰ 定时任务', count: tasks.length },
            { key: 'services', label: '🔧 后台服务', count: services.length },
            { key: 'metrics', label: '📊 系统指标', count: null }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {/* 定时任务管理 */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">定时任务管理</h2>
              <button
                onClick={loadTasks}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                刷新
              </button>
            </div>

            {/* 添加新任务 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">添加新任务</h3>
              <form onSubmit={addTask} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="任务名称"
                  value={newTask.name}
                  onChange={(e) => setNewTask({...newTask, name: e.target.value})}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
                <input
                  type="text"
                  placeholder="Cron 表达式"
                  value={newTask.schedule}
                  onChange={(e) => setNewTask({...newTask, schedule: e.target.value})}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
                <input
                  type="text"
                  placeholder="处理器名称"
                  value={newTask.handler}
                  onChange={(e) => setNewTask({...newTask, handler: e.target.value})}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  添加任务
                </button>
              </form>
            </div>

            {/* 任务列表 */}
            <div className="space-y-4">
              {tasks.map(task => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium">{task.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          task.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {task.enabled ? '启用' : '禁用'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          task.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          task.status === 'running' ? 'bg-yellow-100 text-yellow-800' :
                          task.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.status === 'completed' ? '已完成' :
                           task.status === 'running' ? '运行中' :
                           task.status === 'failed' ? '失败' : '等待中'}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <p>调度: <code className="bg-gray-100 px-1 rounded">{task.schedule}</code></p>
                        <p>处理器: <code className="bg-gray-100 px-1 rounded">{task.handler}</code></p>
                        {task.lastRun && (
                          <p>上次运行: {new Date(task.lastRun).toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleTask(task.id)}
                        disabled={loading}
                        className={`px-3 py-1 rounded text-sm ${
                          task.enabled 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        } disabled:opacity-50`}
                      >
                        {task.enabled ? '禁用' : '启用'}
                      </button>
                      <button
                        onClick={() => runTaskNow(task.id)}
                        disabled={loading || !task.enabled}
                        className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded text-sm disabled:opacity-50"
                      >
                        立即执行
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 后台服务管理 */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">后台服务管理</h2>
              <button
                onClick={loadServices}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                刷新
              </button>
            </div>

            <div className="grid gap-4">
              {services.map(service => (
                <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">{service.name}</h3>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span className={`px-2 py-1 rounded-full ${
                          service.status === 'running' ? 'bg-green-100 text-green-800' :
                          service.status === 'error' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {service.status === 'running' ? '运行中' :
                           service.status === 'error' ? '错误' : '已停止'}
                        </span>
                        {service.startTime && (
                          <span>运行时间: {formatUptime((Date.now() - new Date(service.startTime).getTime()) / 1000)}</span>
                        )}
                        {service.errorCount > 0 && (
                          <span className="text-red-600">错误次数: {service.errorCount}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className={`px-4 py-2 rounded text-sm ${
                          service.status === 'running'
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {service.status === 'running' ? '停止' : '启动'}
                      </button>
                      <button className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded text-sm">
                        重启
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 系统指标 */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">系统指标</h2>
              <button
                onClick={loadMetrics}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                刷新
              </button>
            </div>

            {metrics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-blue-800">服务统计</h3>
                  <div className="mt-2 space-y-1">
                    <p>总服务数: <span className="font-semibold">{metrics.totalServices}</span></p>
                    <p>运行中: <span className="font-semibold text-green-600">{metrics.runningServices}</span></p>
                    <p>错误状态: <span className="font-semibold text-red-600">{metrics.errorServices}</span></p>
                    <p>总错误数: <span className="font-semibold">{metrics.totalErrors}</span></p>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-green-800">系统运行时间</h3>
                  <div className="mt-2">
                    <p className="text-2xl font-bold text-green-600">
                      {formatUptime(metrics.uptime)}
                    </p>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-purple-800">内存使用</h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>RSS: <span className="font-semibold">{formatBytes(metrics.memory.rss)}</span></p>
                    <p>堆总量: <span className="font-semibold">{formatBytes(metrics.memory.heapTotal)}</span></p>
                    <p>堆使用: <span className="font-semibold">{formatBytes(metrics.memory.heapUsed)}</span></p>
                    <p>外部: <span className="font-semibold">{formatBytes(metrics.memory.external)}</span></p>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4 md:col-span-2 lg:col-span-3">
                  <h3 className="text-lg font-medium text-yellow-800">实时状态</h3>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>最后更新: {new Date(metrics.timestamp).toLocaleString()}</p>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{metrics.runningServices}</div>
                        <div className="text-xs text-gray-500">活跃服务</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {Math.round((metrics.memory.heapUsed / metrics.memory.heapTotal) * 100)}%
                        </div>
                        <div className="text-xs text-gray-500">内存使用率</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {Math.floor(metrics.uptime / 3600)}h
                        </div>
                        <div className="text-xs text-gray-500">运行小时</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{metrics.totalErrors}</div>
                        <div className="text-xs text-gray-500">总错误数</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 