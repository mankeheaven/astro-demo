import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// 获取环境变量中的API基础URL，如果未设置则使用默认值
const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:8080';

// 创建axios实例
const instance = axios.create({
  baseURL: API_BASE_URL, // 使用环境变量中的API基础URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求前做些什么
    // 例如，添加token到请求头
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应数据做些什么
    // 这里可以统一处理响应，比如只返回response.data
    return response.data;
  },
  (error: AxiosError) => {
    // 对响应错误做些什么
    const { response } = error;
    
    if (response) {
      // 处理HTTP状态码错误
      switch (response.status) {
        case 401:
          // 未授权，可能需要登录
          console.error('未授权，请登录');
          // 可以在这里处理登录逻辑，如重定向到登录页
          break;
        case 403:
          // 禁止访问
          console.error('禁止访问，没有权限');
          break;
        case 404:
          // 资源不存在
          console.error('请求的资源不存在');
          break;
        case 500:
          // 服务器错误
          console.error('服务器错误');
          break;
        default:
          console.error(`HTTP错误: ${response.status}`, response.data);
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('网络错误，无法连接到服务器');
    } else {
      // 设置请求时发生错误
      console.error('请求配置错误:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// 封装GET请求
export const get = <T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> => {
  return instance.get(url, { params, ...config });
};

// 封装POST请求
export const post = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return instance.post(url, data, config);
};

// 封装PUT请求
export const put = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return instance.put(url, data, config);
};

// 封装DELETE请求
export const del = <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return instance.delete(url, config);
};

// 导出整个实例，方便自定义请求
export default instance; 