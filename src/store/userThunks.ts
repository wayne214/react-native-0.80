import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserState } from './userSlice';
import { saveUserData, clearUserData, getUserData } from './userStorage';

// 异步操作：加载初始用户数据
export const loadInitialUserData = createAsyncThunk(
  'user/loadInitialUserData',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserData();
      return data;
    } catch (error) {
      return rejectWithValue('Failed to load user data from storage');
    }
  }
);

// 异步操作：登录成功后保存用户数据
export const saveLoginData = createAsyncThunk(
  'user/saveLoginData',
  async (userData: { user: User; token: string; favorites: string[]; history: string[] }, { rejectWithValue }) => {
    try {
      await saveUserData({
        currentUser: userData.user,
        isAuthenticated: true,
        token: userData.token,
        favorites: userData.favorites,
        history: userData.history,
      });
    } catch (error) {
      return rejectWithValue('Failed to save login data to storage');
    }
  }
);

// 异步操作：注册成功后保存用户数据
export const saveRegisterData = createAsyncThunk(
  'user/saveRegisterData',
  async (userData: { user: User; token: string; favorites: string[]; history: string[] }, { rejectWithValue }) => {
    try {
      await saveUserData({
        currentUser: userData.user,
        isAuthenticated: true,
        token: userData.token,
        favorites: userData.favorites,
        history: userData.history,
      });
    } catch (error) {
      return rejectWithValue('Failed to save register data to storage');
    }
  }
);

// 异步操作：登出时清除用户数据
export const clearUserSession = createAsyncThunk(
  'user/clearUserSession',
  async (_, { rejectWithValue }) => {
    try {
      await clearUserData();
    } catch (error) {
      return rejectWithValue('Failed to clear user data from storage');
    }
  }
);

// 异步操作：更新用户数据
export const updateUserData = createAsyncThunk(
  'user/updateUserData',
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      // 获取当前存储的数据
      const currentData = await getUserData();
      if (currentData) {
        const updatedData = {
          ...currentData,
          currentUser: currentData.currentUser ? { ...currentData.currentUser, ...userData } : null,
        };
        await saveUserData(updatedData);
      }
    } catch (error) {
      return rejectWithValue('Failed to update user data in storage');
    }
  }
);

// 异步操作：更新收藏列表
export const updateFavorites = createAsyncThunk(
  'user/updateFavorites',
  async (favorites: string[], { rejectWithValue }) => {
    try {
      // 获取当前存储的数据
      const currentData = await getUserData();
      if (currentData) {
        const updatedData = {
          ...currentData,
          favorites,
        };
        await saveUserData(updatedData);
      }
    } catch (error) {
      return rejectWithValue('Failed to update favorites in storage');
    }
  }
);

// 异步操作：更新浏览历史
export const updateHistory = createAsyncThunk(
  'user/updateHistory',
  async (history: string[], { rejectWithValue }) => {
    try {
      // 获取当前存储的数据
      const currentData = await getUserData();
      if (currentData) {
        const updatedData = {
          ...currentData,
          history,
        };
        await saveUserData(updatedData);
      }
    } catch (error) {
      return rejectWithValue('Failed to update history in storage');
    }
  }
);