import { configureStore } from '@reduxjs/toolkit';
import newsReducer from './newsSlice.ts';
import loadingReducer from './loadingSlice.ts';

export const store = configureStore({
  reducer: {
    news: newsReducer,
    loading: loadingReducer,
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
}

export type AppDispatch = typeof store.dispatch;