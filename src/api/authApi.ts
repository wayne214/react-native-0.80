// src/api/authApi.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 定义API基础URL - 在实际项目中，这里应该是你的后端API地址
const API_BASE_URL = 'http://localhost:3000/api'; // 替换为实际的后端API地址

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加认证token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理认证错误
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 清除本地存储的用户数据
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('token');
      // 可以在这里触发登出操作
    }
    return Promise.reject(error);
  }
);

// 定义认证相关的API方法
export const authApi = {
  // 用户注册
  register: async (userData: { username: string; email: string; password: string }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // 用户登录
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // 获取当前用户信息
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // 更新用户信息
  updateProfile: async (userData: Partial<{ username: string; email: string; avatar: string }>) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  // 刷新token
  refreshToken: async () => {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  }
};

// 定义用户相关的API方法
export const userApi = {
  // 获取用户的收藏列表
  getFavorites: async () => {
    const response = await api.get('/user/favorites');
    return response.data;
  },

  // 添加到收藏
  addToFavorites: async (newsId: string) => {
    const response = await api.post(`/user/favorites/${newsId}`);
    return response.data;
  },

  // 从收藏中移除
  removeFromFavorites: async (newsId: string) => {
    const response = await api.delete(`/user/favorites/${newsId}`);
    return response.data;
  },

  // 获取浏览历史
  getHistory: async () => {
    const response = await api.get('/user/history');
    return response.data;
  },

  // 添加到浏览历史
  addToHistory: async (newsId: string) => {
    const response = await api.post(`/user/history/${newsId}`);
    return response.data;
  }
};