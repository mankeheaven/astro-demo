import { UserProvider, useUser } from '../contexts/UserContext';

 function UserProfile() {
  const { username, theme } = useUser();
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">用户资料</h2>
      
      <div className="space-y-4">
        <div>
          <p className="text-gray-600 dark:text-gray-300">用户名</p>
          <p className="font-medium text-black dark:text-white">{username}</p>
        </div>
        
        <div>
          <p className="text-gray-600 dark:text-gray-300">当前主题</p>
          <p className="font-medium text-black dark:text-white">
            {theme === 'light' ? '浅色模式' : '深色模式'}
          </p>
        </div>
        
        <div className="pt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <em>这些数据从UserContext共享，在组件之间保持同步，并存储在localStorage中</em>
          </p>
        </div>
      </div>
    </div>
  );
} 


function UserProfileWrapper() {
  return (
    <UserProvider>
      <UserProfile />
    </UserProvider>
  );
}

export default UserProfileWrapper;