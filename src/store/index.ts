import { configureStore } from '@reduxjs/toolkit';
import newsReducer from './newsSlice.ts';
import loadingReducer from './loadingSlice.ts';
import userReducer from './userSlice.ts';

export const store = configureStore({
  reducer: {
    news: newsReducer,
    loading: loadingReducer,
    user: userReducer,
  },
});

// 为 RootState 添加更具体的类型定义
export interface RootState {
  news: {
    newsList: any[];
    currentPage: number;
    hasMore: boolean;
    error: string | null;
  };
  loading: {
    isLoading: boolean;
    message: string;
  };
  user: {
    currentUser: {
      id: string;
      username: string;
      email: string;
      avatar?: string;
      createdAt: string;
    } | null;
    isAuthenticated: boolean;
    token: string | null;
    loading: boolean;
    error: string | null;
    favorites: string[];
    history: string[];
  };
}

export type AppDispatch = typeof store.dispatch;