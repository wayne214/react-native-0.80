import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分钟内数据被认为是新鲜的
      gcTime: 10 * 60 * 1000, // 10分钟垃圾回收时间
      retry: 2, // 请求失败时重试2次
      retryDelay: (attemptIndex) => {
        return Math.min(1000 * 2 ** attemptIndex, 30000); // 指数退避重试
      },
      refetchOnWindowFocus: false, // 窗口获得焦点时不自动刷新
      refetchOnReconnect: true, // 重连时自动刷新
    },
  },
});