import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 定义状态类型
interface GlobalState {
  // 计数器相关
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  
  // 消息相关
  messages: string[];
  addMessage: (message: string) => void;
  clearMessages: () => void;
  
  // 最后访问页面
  lastVisitedPage: string;
  setLastVisitedPage: (page: string) => void;
}

// 创建安全的存储
const storage = createJSONStorage(() => {
  if (typeof window === 'undefined') {
    // 在服务器端返回一个空的存储实现
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }
  return localStorage;
});

// 创建持久化的全局状态存储
const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      // 初始计数器状态
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
      reset: () => set({ count: 0 }),
      
      // 初始消息状态
      messages: [],
      addMessage: (message) => set((state) => ({ 
        messages: [...state.messages, `${new Date().toLocaleTimeString()}: ${message}`] 
      })),
      clearMessages: () => set({ messages: [] }),
      
      // 最后访问页面
      lastVisitedPage: '',
      setLastVisitedPage: (page) => set({ lastVisitedPage: page }),
    }),
    {
      name: 'global-store', // localStorage的key名称
      storage: storage,
    }
  )
);

export default useGlobalStore; 