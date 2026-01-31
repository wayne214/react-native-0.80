import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 定义用户类型
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

// 定义用户状态
export interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
  favorites: string[]; // 收藏的新闻ID列表
  history: string[]; // 浏览历史的新闻ID列表
}

// 存储键名
const USER_DATA_KEY = 'userData';

// 从本地存储获取初始状态的异步函数
export const getUserInitialState = async (): Promise<UserState> => {
  try {
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    if (userData) {
      return JSON.parse(userData);
    }
  } catch (error) {
    console.error('Failed to parse user data from storage:', error);
  }

  return {
    currentUser: null,
    isAuthenticated: false,
    token: null,
    loading: false,
    error: null,
    favorites: [],
    history: [],
  };
};

// 初始状态（默认值，实际状态将在应用启动时通过 thunk 或 effect 设置）
const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null,
  favorites: [],
  history: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 登录相关操作
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // 注册相关操作
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // 登出操作
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.token = null;
      state.favorites = [];
      state.history = [];
    },
    
    // 更新用户信息
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    
    // 收藏新闻
    addToFavorites: (state, action: PayloadAction<string>) => {
      if (state.currentUser && !state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
      }
    },
    
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      if (state.currentUser) {
        state.favorites = state.favorites.filter(id => id !== action.payload);
      }
    },
    
    // 添加浏览历史
    addToHistory: (state, action: PayloadAction<string>) => {
      // 移除已存在的历史记录，保持最新顺序
      state.history = state.history.filter(id => id !== action.payload);
      state.history.unshift(action.payload);
      
      // 限制历史记录数量（例如最多50条）
      if (state.history.length > 50) {
        state.history = state.history.slice(0, 50);
      }
    },
    
    // 清除错误信息
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  updateUser,
  addToFavorites,
  removeFromFavorites,
  addToHistory,
  clearError
} = userSlice.actions;

export default userSlice.reducer;