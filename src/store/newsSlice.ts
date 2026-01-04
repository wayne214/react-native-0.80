import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 定义新闻项的类型
export interface NewsItem {
  title: string;
  category: string;
  uniquekey: string;
  thumbnail_pic_s: string;
  date: string;
  author_name: string;
  url: string;
}

// 定义news slice的state类型
export interface NewsState {
  newsList: NewsItem[];
  currentPage: number;
  hasMore: boolean;
  error: string | null;
}

// 初始化state
const initialState: NewsState = {
  newsList: [],
  currentPage: 1,
  hasMore: true,
  error: null,
};

// 创建news slice
export const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setNewsList: (state, action: PayloadAction<NewsItem[]>) => {
      state.newsList = action.payload;
    },
    appendNewsList: (state, action: PayloadAction<NewsItem[]>) => {
      state.newsList = [...state.newsList, ...action.payload];
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearNewsList: (state) => {
      state.newsList = [];
      state.currentPage = 1;
      state.hasMore = true;
      state.error = null;
    },
  },
});

// 导出actions
export const {
  setNewsList,
  appendNewsList,
  setCurrentPage,
  setHasMore,
  setError,
  clearNewsList,
} = newsSlice.actions;

export default newsSlice.reducer;
