import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 定义loading slice的state类型
export interface LoadingState {
  isLoading: boolean;
  message: string;
}

// 初始化state
const initialState: LoadingState = {
  isLoading: false,
  message: '加载中...',
};

// 创建loading slice
export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    showLoading: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.message = action.payload;
    },
    hideLoading: (state) => {
      state.isLoading = false;
      state.message = '加载中...';
    },
  },
});

// 导出actions
export const { showLoading, hideLoading } = loadingSlice.actions;

export default loadingSlice.reducer;