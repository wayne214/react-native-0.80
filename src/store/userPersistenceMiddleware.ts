import { Middleware } from '@reduxjs/toolkit';
import { loginSuccess, logout, addToFavorites, removeFromFavorites, addToHistory, updateUser } from './userSlice';
import { saveUserData, clearUserData } from './userStorage';

// 创建一个中间件来处理用户数据的持久化
export const userDataPersistenceMiddleware: Middleware = (storeAPI) => (next) => (action) => {
  const result = next(action);
  
  // 检查是否需要保存用户数据
  if (
    loginSuccess.match(action) ||
    logout.match(action) ||
    addToFavorites.match(action) ||
    removeFromFavorites.match(action) ||
    addToHistory.match(action) ||
    updateUser.match(action)
  ) {
    // 获取最新的状态
    const state = storeAPI.getState();
    // @ts-ignore - 我们知道 state 有 user 属性
    const userState = state.user;
    
    if (userState) {
      // 对于登出操作，只清除数据
      if (logout.match(action)) {
        clearUserData().catch(error => {
          console.error('Failed to clear user data after logout:', error);
        });
      } else {
        // 对于其他操作，保存完整用户数据
        saveUserData({
          currentUser: userState.currentUser,
          isAuthenticated: userState.isAuthenticated,
          token: userState.token,
          favorites: userState.favorites || [],
          history: userState.history || [],
        }).catch(error => {
          console.error('Failed to save user data:', error);
        });
      }
    }
  }
  
  return result;
};