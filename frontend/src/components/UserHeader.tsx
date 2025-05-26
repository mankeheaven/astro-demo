import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';

export default function UserHeader() {
  const { username, theme, setUsername, setTheme } = useUser();
  const [newName, setNewName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const handleSave = () => {
    if (newName.trim()) {
      setUsername(newName);
      setNewName('');
    }
    setIsEditing(false);
  };
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
      <div className="flex justify-between items-center">
        <div>
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="border rounded px-2 py-1"
                placeholder="输入新用户名"
              />
              <button 
                onClick={handleSave}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                保存
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="font-medium">欢迎, {username}</span>
              <button 
                onClick={() => setIsEditing(true)}
                className="text-blue-500 text-sm"
              >
                编辑
              </button>
            </div>
          )}
        </div>
        
        <button 
          onClick={toggleTheme}
          className="flex items-center space-x-1 bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded"
        >
          {theme === 'light' ? '🌙 深色' : '☀️ 浅色'}
        </button>
      </div>
    </div>
  );
} 