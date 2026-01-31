import { configureStore } from '@reduxjs/toolkit';
import userReducer, { UserState } from './userSlice';
import { 
  loadInitialUserData, 
  saveLoginData, 
  saveRegisterData, 
  clearUserSession, 
  updateUserData, 
  updateFavorites, 
  updateHistory 
} from './userThunks';

// 创建一个增强版的 store，包含对用户数据持久化的处理
export const setupUserStore = () => {
  const store = configureStore({
    reducer: {
      user: userReducer,
    },
  });

  // 监听状态变化并自动保存到存储
  let lastUserState: UserState | null = null;

  store.subscribe(() => {
    const currentState = store.getState().user as UserState;
    
    // 检查是否需要保存用户数据
    if (lastUserState) {
      // 如果认证状态发生变化（登录/登出），触发相应操作
      if (!lastUserState.isAuthenticated && currentState.isAuthenticated) {
        // 用户刚登录，保存数据
        if (currentState.currentUser && currentState.token) {
          store.dispatch(saveLoginData({
            user: currentState.currentUser,
            token: currentState.token,
            favorites: currentState.favorites,
            history: currentState.history,
          }));
        }
      } else if (lastUserState.isAuthenticated && !currentState.isAuthenticated) {
        // 用户刚登出，清除数据
        store.dispatch(clearUserSession());
      }
      
      // 如果收藏列表发生变化，保存更新
      if (JSON.stringify(lastUserState.favorites) !== JSON.stringify(currentState.favorites)) {
        store.dispatch(updateFavorites(currentState.favorites));
      }
      
      // 如果浏览历史发生变化，保存更新
      if (JSON.stringify(lastUserState.history) !== JSON.stringify(currentState.history)) {
        store.dispatch(updateHistory(currentState.history));
      }
      
      // 如果用户信息发生变化，保存更新
      if (
        lastUserState.currentUser?.id !== currentState.currentUser?.id ||
        lastUserState.currentUser?.username !== currentState.currentUser?.username ||
        lastUserState.currentUser?.email !== currentState.currentUser?.email ||
        lastUserState.currentUser?.avatar !== currentState.currentUser?.avatar
      ) {
        if (currentState.currentUser) {
          store.dispatch(updateUserData(currentState.currentUser));
        }
      }
    }
    
    lastUserState = currentState;
  });

  return store;
};

export type RootState = ReturnType<ReturnType<typeof setupUserStore>['getState']>;
export type AppDispatch = ReturnType<typeof setupUserStore>['dispatch'];

export default setupUserStore;