import React, { useState, useEffect } from 'react';
import { actions } from 'astro:actions';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

interface Task {
  id: number;
  name: string;
  description?: string;
  schedule: string;
  handler: string;
  enabled: boolean;
  lastRun?: Date;
  status: 'pending' | 'running' | 'completed' | 'failed';
  errorCount: number;
}

interface Stats {
  totalUsers: number;
  totalTasks: number;
  enabledTasks: number;
  tasksByStatus: {
    pending: number;
    running: number;
    completed: number;
    failed: number;
  };
}

export default function DatabaseDemo() {
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 获取用户列表
      const usersResult = await actions.userGetAll({ limit: 20, offset: 0 });
      if (usersResult.data?.success) {
        setUsers(usersResult.data.users);
      }

      // 获取任务列表
      const tasksResult = await actions.taskGetAll();
      if (tasksResult.data?.success) {
        setTasks(tasksResult.data.tasks);
      }

      // 获取统计信息
      const statsResult = await actions.statsGetDashboard();
      if (statsResult.data?.success) {
        setStats(statsResult.data.stats);
      }
    } catch (error) {
      console.error('加载数据失败:', error);
      setError('加载数据失败: ' + (error instanceof Error ? error.message : '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const timestamp = Date.now();
      // 生成较短的用户名，确保不超过 20 个字符
      const shortId = Math.random().toString(36).substring(2, 8); // 6位随机字符
      const username = `user_${shortId}`; // 最多 11 个字符
      
      const result = await actions.userRegister({
        username,
        email: `test_${shortId}@example.com`,
        password: 'password123',
        confirmPassword: 'password123',
        role: 'user'
      });

      if (result.data?.success) {
        setSuccess('用户创建成功！');
        await loadData(); // 重新加载数据
      } else {
        setError('创建用户失败');
      }
    } catch (error) {
      console.error('创建用户失败:', error);
      setError('创建用户失败: ' + (error instanceof Error ? error.message : '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const timestamp = Date.now();
      
      const result = await actions.taskCreate({
        name: `测试任务_${timestamp}`,
        description: '这是一个测试任务',
        schedule: '0 * * * *',
        handler: 'cleanupOldData',
        enabled: true
      });

      if (result.data?.success) {
        setSuccess('任务创建成功！');
        await loadData(); // 重新加载数据
      } else {
        setError('创建任务失败');
      }
    } catch (error) {
      console.error('创建任务失败:', error);
      setError('创建任务失败: ' + (error instanceof Error ? error.message : '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: number) => {
    if (!confirm('确定要删除这个用户吗？')) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await actions.userDelete({ userId });
      
      if (result.data?.success) {
        setSuccess('用户删除成功！');
        await loadData(); // 重新加载数据
      } else {
        setError('删除用户失败');
      }
    } catch (error) {
      console.error('删除用户失败:', error);
      setError('删除用户失败: ' + (error instanceof Error ? error.message : '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskId: number) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await actions.taskToggle({ taskId });
      
      if (result.data?.success) {
        setSuccess('任务状态已更新！');
        await loadData(); // 重新加载数据
      } else {
        setError('更新任务状态失败');
      }
    } catch (error) {
      console.error('更新任务状态失败:', error);
      setError('更新任务状态失败: ' + (error instanceof Error ? error.message : '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  const runTask = async (taskId: number) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await actions.taskRun({ taskId });
      
      if (result.data?.success) {
        setSuccess(`任务执行成功！耗时: ${result.data.duration}ms`);
        await loadData(); // 重新加载数据
      } else {
        setError('执行任务失败');
      }
    } catch (error) {
      console.error('执行任务失败:', error);
      setError('执行任务失败: ' + (error instanceof Error ? error.message : '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2">加载中...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">SQLite 数据库演示</h2>
        <div className="space-x-2">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
              ❌ {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded text-sm">
              ✅ {success}
            </div>
          )}
        </div>
      </div>

      {/* 统计信息 */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-100 p-4 rounded">
            <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
            <div className="text-sm text-blue-800">总用户数</div>
          </div>
          <div className="bg-green-100 p-4 rounded">
            <div className="text-2xl font-bold text-green-600">{stats.totalTasks}</div>
            <div className="text-sm text-green-800">总任务数</div>
          </div>
          <div className="bg-yellow-100 p-4 rounded">
            <div className="text-2xl font-bold text-yellow-600">{stats.enabledTasks}</div>
            <div className="text-sm text-yellow-800">启用任务</div>
          </div>
          <div className="bg-purple-100 p-4 rounded">
            <div className="text-2xl font-bold text-purple-600">{stats.tasksByStatus.completed}</div>
            <div className="text-sm text-purple-800">已完成任务</div>
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={createUser}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          创建测试用户
        </button>
        <button
          onClick={createTask}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50"
        >
          创建测试任务
        </button>
        <button
          onClick={loadData}
          disabled={loading}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          刷新数据
        </button>
      </div>

      {/* 用户列表 */}
      <div>
        <h3 className="text-lg font-semibold mb-2">用户列表</h3>
        <div className="bg-white rounded border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">用户名</th>
                <th className="px-4 py-2 text-left">邮箱</th>
                <th className="px-4 py-2 text-left">角色</th>
                <th className="px-4 py-2 text-left">创建时间</th>
                <th className="px-4 py-2 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-2">{user.id}</td>
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-2">{new Date(user.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => deleteUser(user.id)}
                      disabled={loading}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 任务列表 */}
      <div>
        <h3 className="text-lg font-semibold mb-2">任务列表</h3>
        <div className="bg-white rounded border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">名称</th>
                <th className="px-4 py-2 text-left">调度</th>
                <th className="px-4 py-2 text-left">状态</th>
                <th className="px-4 py-2 text-left">启用</th>
                <th className="px-4 py-2 text-left">错误次数</th>
                <th className="px-4 py-2 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id} className="border-t">
                  <td className="px-4 py-2">{task.id}</td>
                  <td className="px-4 py-2">{task.name}</td>
                  <td className="px-4 py-2"><code className="bg-gray-100 px-1 rounded">{task.schedule}</code></td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      task.status === 'completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'running' ? 'bg-yellow-100 text-yellow-800' :
                      task.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {task.enabled ? '✅' : '❌'}
                  </td>
                  <td className="px-4 py-2">{task.errorCount}</td>
                  <td className="px-4 py-2">
                    <div className="space-x-2">
                      <button
                        onClick={() => toggleTask(task.id)}
                        disabled={loading}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors disabled:opacity-50"
                      >
                        {task.enabled ? '禁用' : '启用'}
                      </button>
                      <button
                        onClick={() => runTask(task.id)}
                        disabled={loading || !task.enabled}
                        className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        执行
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 