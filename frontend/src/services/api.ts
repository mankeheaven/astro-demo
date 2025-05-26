import { get, post, put, del } from '../utils/request';

// 定义一些可能的数据接口
export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

// 用户相关API
export const userApi = {
  // 获取用户信息
  getUserInfo: (): Promise<User> => get('/api/user/info'),
  
  // 更新用户信息
  updateUserInfo: (data: Partial<User>): Promise<User> => 
    put('/api/user/info', data),
  
  // 用户登录
  login: (username: string, password: string): Promise<{token: string}> => 
    post('/api/user/login', { username, password }),
  
  // 用户注册
  register: (userData: {username: string, password: string, email: string}): Promise<void> => 
    post('/api/user/register', userData)
};

// 文章相关API
export const articleApi = {
  // 获取文章列表
  getArticles: (page = 1, size = 10): Promise<{list: Article[], total: number}> => 
    get('/api/articles', { page, size }),
  
  // 获取文章详情
  getArticleById: (id: number): Promise<Article> => 
    get(`/api/articles/${id}`),
  
  // 创建文章
  createArticle: (article: Omit<Article, 'id' | 'author' | 'createdAt' | 'updatedAt'>): Promise<Article> => 
    post('/api/articles', article),
  
  // 更新文章
  updateArticle: (id: number, article: Partial<Article>): Promise<Article> => 
    put(`/api/articles/${id}`, article),
  
  // 删除文章
  deleteArticle: (id: number): Promise<void> => 
    del(`/api/articles/${id}`)
};

// 健康检查API
export const healthApi = {
  check: (): Promise<{status: string}> => get('/api/health')
};

// 可以根据需要添加更多API模块... 