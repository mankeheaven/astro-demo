import React, { useState } from 'react';
import { actions } from 'astro:actions';

export default function ActionsDemo() {
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, any>>({});

  // 用户注册演示
  const handleUserRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading('register');
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await actions.userRegister({
        username: formData.get('username') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        confirmPassword: formData.get('confirmPassword') as string,
        role: 'user'
      });
      
      setResults(prev => ({ ...prev, register: result }));
    } catch (error) {
      setResults(prev => ({ ...prev, register: { error: error instanceof Error ? error.message : '注册失败' } }));
    } finally {
      setLoading(null);
    }
  };

  // 计算器演示
  const handleCalculate = async (operation: string) => {
    setLoading('calculate');
    
    try {
      const result = await actions.calculate({
        operation: operation as any,
        a: 10,
        b: 5
      });
      
      setResults(prev => ({ ...prev, calculate: result }));
    } catch (error) {
      setResults(prev => ({ ...prev, calculate: { error: error instanceof Error ? error.message : '计算失败' } }));
    } finally {
      setLoading(null);
    }
  };

  // 发送消息演示
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading('message');
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await actions.sendMessage({
        name: formData.get('name') as string,
        message: formData.get('message') as string,
        type: 'general'
      });
      
      setResults(prev => ({ ...prev, message: result }));
    } catch (error) {
      setResults(prev => ({ ...prev, message: { error: error instanceof Error ? error.message : '发送失败' } }));
    } finally {
      setLoading(null);
    }
  };

  // 获取用户信息演示
  const handleGetUser = async (userId: string) => {
    setLoading('getUser');
    
    try {
      const result = await actions.getUserInfo({ userId });
      setResults(prev => ({ ...prev, getUser: result }));
    } catch (error) {
      setResults(prev => ({ ...prev, getUser: { error: error instanceof Error ? error.message : '获取失败' } }));
    } finally {
      setLoading(null);
    }
  };

  const ResultDisplay = ({ title, result }: { title: string; result: any }) => {
    if (!result) return null;
    
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">{title} 结果:</h4>
        <pre className="text-sm text-gray-600 overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* 用户注册演示 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">👤 用户注册演示</h3>
        <form onSubmit={handleUserRegister} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="username"
              placeholder="用户名"
              required
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              name="email"
              placeholder="邮箱"
              required
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              name="password"
              placeholder="密码"
              required
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="确认密码"
              required
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading === 'register'}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center space-x-2"
          >
            {loading === 'register' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
            <span>注册用户</span>
          </button>
        </form>
        <ResultDisplay title="用户注册" result={results.register} />
      </div>

      {/* 计算器演示 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">🧮 计算器演示</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['add', 'subtract', 'multiply', 'divide'].map((op) => (
            <button
              key={op}
              onClick={() => handleCalculate(op)}
              disabled={loading === 'calculate'}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50"
            >
              {op === 'add' && '10 + 5'}
              {op === 'subtract' && '10 - 5'}
              {op === 'multiply' && '10 × 5'}
              {op === 'divide' && '10 ÷ 5'}
            </button>
          ))}
        </div>
        <ResultDisplay title="计算器" result={results.calculate} />
      </div>

      {/* 消息发送演示 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">💬 消息发送演示</h3>
        <form onSubmit={handleSendMessage} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="您的姓名"
              required
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <textarea
              name="message"
              placeholder="消息内容"
              required
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading === 'message'}
            className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 disabled:opacity-50 flex items-center space-x-2"
          >
            {loading === 'message' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
            <span>发送消息</span>
          </button>
        </form>
        <ResultDisplay title="消息发送" result={results.message} />
      </div>

      {/* 用户查询演示 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">🔍 用户查询演示</h3>
        <div className="space-y-4">
          <p className="text-gray-600">点击按钮查询不同的用户信息（支持 ID: 1, 2, 3）:</p>
          <div className="flex space-x-4">
            {['1', '2', '3', '999'].map((userId) => (
              <button
                key={userId}
                onClick={() => handleGetUser(userId)}
                disabled={loading === 'getUser'}
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 disabled:opacity-50"
              >
                查询用户 {userId}
              </button>
            ))}
          </div>
        </div>
        <ResultDisplay title="用户查询" result={results.getUser} />
      </div>

      {/* 使用说明 */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold mb-3 text-blue-800">💡 使用说明</h3>
        <ul className="text-blue-700 space-y-2">
          <li>• <strong>用户注册</strong>: 尝试输入用户名 "admin" 来测试错误处理</li>
          <li>• <strong>计算器</strong>: 演示了基本的数学运算和除零错误处理</li>
          <li>• <strong>消息发送</strong>: 模拟消息发送功能，支持不同类型的消息</li>
          <li>• <strong>用户查询</strong>: 支持查询 ID 1, 2, 3 的用户，其他 ID 会返回错误</li>
        </ul>
      </div>
    </div>
  );
} 