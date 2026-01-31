import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from './userSlice';

// 存储键名
const USER_DATA_KEY = 'userData';

// 保存用户数据到本地存储
export const saveUserData = async (data: {
  currentUser: User | null;
  isAuthenticated: boolean;
  token: string | null;
  favorites: string[];
  history: string[];
}): Promise<void> => {
  try {
    const saveData = {
      currentUser: data.currentUser,
      isAuthenticated: data.isAuthenticated,
      token: data.token,
      favorites: data.favorites,
      history: data.history,
    };
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(saveData));
  } catch (error) {
    console.error('Failed to save user data to storage:', error);
  }
};

// 从本地存储清除用户数据
export const clearUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_DATA_KEY);
  } catch (error) {
    console.error('Failed to remove user data from storage:', error);
  }
};

// 获取本地存储中的用户数据
export const getUserData = async (): Promise<{
  currentUser: User | null;
  isAuthenticated: boolean;
  token: string | null;
  favorites: string[];
  history: string[];
} | null> => {
  try {
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    if (userData) {
      return JSON.parse(userData);
    }
  } catch (error) {
    console.error('Failed to get user data from storage:', error);
  }
  
  return null;
};