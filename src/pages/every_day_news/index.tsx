import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ApiContants from '../../api/api_contants.ts';

// 定义API响应类型
interface ApiResponse {
  code: number;
  data: {
    imageurl: string;
  } | null;
  message?: string;
}

// 定义每日新闻数据类型
interface DailyNewsData {
  imageurl: string;
}

// API函数，用于获取每日新闻数据
const fetchDailyNews = async (): Promise<DailyNewsData> => {
  const response = await axios.get<ApiResponse>(ApiContants.every_day_news);
  
  if (response.data.code === 200 && response.data.data) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || '获取每日新闻数据失败');
  }
};

function EveryDayNews() {
  // 使用TanStack Query获取数据
  const {
    data: dailyNewsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['dailyNews'],
    queryFn: fetchDailyNews,
    staleTime: 10 * 60 * 1000, // 10分钟内数据被认为是新鲜的
    gcTime: 15 * 60 * 1000, // 15分钟垃圾回收时间
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  // 如果正在加载，可以显示加载状态（这里使用WebView的loading属性）
  // 如果有错误，可以显示错误信息或重试按钮
  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <WebView
            source={{
              html: `
                <div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column;">
                  <h2>加载失败</h2>
                  <p>${error.message}</p>
                  <button onclick="location.reload()" style="padding: 10px 20px; margin-top: 20px; background-color: #007AFF; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    重试
                  </button>
                </div>
              `
            }}
            style={styles.webContainer}
            onNavigationStateChange={(navState) => {
              if (navState.url === 'about:blank' && navState.title === 'Error') {
                refetch();
              }
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri: dailyNewsData?.imageurl || '' }} 
        style={styles.webContainer}
        startInLoadingState={true}
        scalesPageToFit={true}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent.description);
        }}
        onHttpError={(event) => {
          console.warn('HTTP Error: ', event.nativeEvent.statusCode, event.nativeEvent.url);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webContainer: {
    flex: 1
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default EveryDayNews;