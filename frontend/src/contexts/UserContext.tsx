import React, { createContext, useState, useEffect, useContext } from 'react';

// 定义用户状态的类型
type UserContextType = {
  username: string;
  theme: 'light' | 'dark';
  setUsername: (name: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
};

// 创建上下文
const UserContext = createContext<UserContextType | null>(null);

// Astro客户端指令类型
type AstroClientDirectives = {
  'client:load'?: boolean;
  'client:idle'?: boolean;
  'client:visible'?: boolean;
  'client:media'?: string;
  'client:only'?: string;
};

// 安全的localStorage访问函数
const getStorageItem = (key: string, defaultValue: string): string => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  try {
    return localStorage.getItem(key) || defaultValue;
  } catch {
    return defaultValue;
  }
};

const setStorageItem = (key: string, value: string): void => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(key, value);
  } catch {
    // 静默处理localStorage错误
  }
};

// 创建Provider组件 - 使children可选以支持Astro
export function UserProvider({ 
  children,
  ...props
}: { 
  children?: React.ReactNode;
} & AstroClientDirectives) {
  // 使用简单的默认值初始化，避免在SSR时访问localStorage
  const [username, setUsername] = useState<string>('访客用户');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isHydrated, setIsHydrated] = useState(false);
  
  // 在客户端水合后加载localStorage数据
  useEffect(() => {
    setUsername(getStorageItem('username', '访客用户'));
    setTheme(getStorageItem('theme', 'light') as 'light' | 'dark');
    setIsHydrated(true);
  }, []);
  
  // 当状态变化时，更新localStorage (仅在水合后)
  useEffect(() => {
    if (isHydrated) {
      setStorageItem('username', username);
    }
  }, [username, isHydrated]);
  
  useEffect(() => {
    if (isHydrated) {
      setStorageItem('theme', theme);
      // 更新文档的主题类
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
      }
    }
  }, [theme, isHydrated]);
  
  const value = {
    username,
    theme,
    setUsername,
    setTheme
  };
  
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// 创建自定义Hook来使用上下文
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser必须在UserProvider内部使用');
  }
  return context;
} 