import React from 'react';
import { UserProvider } from '../contexts/UserContext';
import UserHeader from './UserHeader';
import UserProfile from './UserProfile';
import useGlobalStore from 'src/stores/globalStore';

export default function App() {

  const { count } = useGlobalStore();
  return (
    <UserProvider>
      <UserHeader />
      
      <div className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          这个演示展示了如何在多个React组件之间共享状态。
          用户信息和主题设置在头部组件中更改，并在用户资料组件中同步显示。
          数据也会存储在localStorage中，因此在页面刷新后依然保持。
        </p>
      </div>

      <div className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 mb-4">
            全局计数器: {count}
        </p>
      </div>
      
      <UserProfile />
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 dark:text-white">如何工作？</h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <ol className="list-decimal list-inside space-y-2 text-gray-800 dark:text-gray-200">
            <li>使用React Context API创建共享状态</li>
            <li>UserProvider组件提供状态和更新函数</li>
            <li>组件通过useUser钩子访问状态</li>
            <li>状态变化后自动存储到localStorage</li>
            <li>页面刷新时从localStorage恢复状态</li>
          </ol>
        </div>
      </div>
    </UserProvider>
  );
} 