import React, { useCallback, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Dimensions } from 'react-native';
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import axios from 'axios';
import { LoadingManager } from '../../component/loading/LoadingManager';
import { RefreshableList } from '../../component/list/RefreshableList';
import { CustomRefreshHeader } from '../../component/list/CustomRefreshHeader';

import { HOT_NEWS } from '../../api/api_contants';
// 导入Redux相关
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  setNewsList,
  appendNewsList,
  setCurrentPage,
  setHasMore,
  setError,
  clearNewsList,
} from '../../store/newsSlice';
import { showLoading, hideLoading } from '../../store/loadingSlice';

const NEWS_API = HOT_NEWS;

// API 响应类型定义
interface APIResponse<T> {
  code: number;
  data: T;
  message?: string;
}

interface NewsItem {
  title: string;
  id: string;
  cover: string;
  timestamp: number;
  hot: number;
  url: string;
  mobileUrl: string;
}

// 定义 Details 页面接收的参数类型
type RootStackParamList = {
  Details: { pageUrl: string; title: string };
};

// 组件 Props 类型
interface RenderItemProps {
  item: NewsItem;
  index: number;
}

const HotNewsList: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // 使用Redux状态替代本地useState
  const dispatch = useDispatch();
  const { newsList, currentPage, hasMore, error } = useSelector((state: RootState) => state.news);
  const { isLoading } = useSelector((state: RootState) => state.loading);

  useEffect(() => {
    getNewsData(1, true);
  }, []);

  const getNewsData = async (page: number = 1, isRefresh: boolean = false): Promise<void> => {
    if (isLoading && !isRefresh) return; // 防止重复请求

    try {
      dispatch(showLoading('加载中...'));
      dispatch(setError(null));

      const response = await axios.get<APIResponse<NewsItem[]>>(`${NEWS_API}?page=${page}`, {
        timeout: 10000, // 10秒超时
      });

      console.log('获取新闻数据成功:', response.data)

      if(response.data.code === 200) {
        const newData = response.data.data || [];

        if (isRefresh) {
          // 刷新时替换数据
          dispatch(setNewsList(newData));
          dispatch(setCurrentPage(2));
          dispatch(setHasMore(newData.length > 0));
        } else {
          // 加载更多时追加数据
          dispatch(appendNewsList(newData));
          dispatch(setCurrentPage(page + 1));
          dispatch(setHasMore(newData.length > 0));
        }
      } else {
        dispatch(setError(response.data.message || '获取数据失败'));
      }
    } catch (error) {
      console.error('获取新闻数据失败:', error);
      const errorMessage = axios.isAxiosError(error)
        ? (error.code === 'ECONNABORTED' ? '请求超时，请检查网络连接' : '网络错误，请稍后重试')
        : '未知错误发生';
      dispatch(setError(errorMessage));
    } finally {
      dispatch(hideLoading());
      LoadingManager.hide();
    }
  }

  // 根据今日头条API实际数据结构的日期处理
  const formatDate = useCallback((timestamp: number, index: number): string => {
    try {
      // 今日头条API的timestamp字段不是标准时间戳
      // 我们根据热度排名来显示相对时间
      const currentDate = new Date();

      if (index < 5) {
        // 前5条显示为"刚刚"
        return '刚刚';
      } else if (index < 15) {
        // 6-15条显示为"1小时前"
        return '1小时前';
      } else if (index < 30) {
        // 16-30条显示为"2小时前"
        return '2小时前';
      } else {
        // 其余显示为今天日期
        return currentDate.toLocaleDateString('zh-CN', {
          month: '2-digit',
          day: '2-digit'
        });
      }
    } catch (error) {
      console.warn('日期格式化错误:', error);
      return '今日';
    }
  }, []);

  const gotoDetail = useCallback((url: string, title: string) => {
    navigation.navigate("Details", {pageUrl: url, title: title})
  }, [navigation])

  // 下拉刷新处理
  const handleRefresh = async () => {
    await getNewsData(1, true);
  };

  // 上拉加载更多处理
  const handleLoadMore = async () => {
    if (hasMore) {
      await getNewsData(currentPage);
    }
  };

  const renderItem = useCallback(({ item, index }: RenderItemProps) => {
    return (
      <Pressable
        onPress={()=>gotoDetail(item.mobileUrl, item.title)}
        style={({ pressed }) => [
          styles.itemContainer,
          pressed && styles.itemPressed
        ]}
      >
        <View style={styles.item}>
          <Image
            source={{uri: item.cover}}
            style={styles.cover}
            resizeMode="cover"
            // 内存优化
            loadingIndicatorSource={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='}}
            // defaultSource={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='}}
          />
          <View style={styles.contentContainer}>
            <Text style={styles.title} numberOfLines={2} ellipsizeMode={'tail'}>
              {item.title}
            </Text>
            <View style={styles.metaContainer}>
              <Text style={styles.hotLabel}>🔥 热度: {item.hot}</Text>
              <Text style={styles.timeLabel}>
                {formatDate(item.timestamp, index)}
              </Text>
            </View>
          </View>
          <View style={styles.rankContainer}>
            <Text style={styles.rankNumber}>{index + 1}</Text>
          </View>
        </View>
      </Pressable>
    )
  }, [gotoDetail])

  // 重试加载
  const retryLoad = useCallback(() => {
    dispatch(setError(null));
    getNewsData(1, true);
  }, []);

  // 优化的 keyExtractor
  const keyExtractor = useCallback((item: NewsItem, index: number): string => {
    return `${item.id}-${index}`;
  }, []);

  const gotoChartsPage = () => {
    // navigation.navigate("ChartsPage")
  }

  // 渲染错误状态
  const renderError = () => {
    if (!error) return null;

    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={retryLoad}>
          <Text style={styles.retryButtonText}>重试</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔥 今日热闻</Text>
        <Text style={styles.headerSubtitle}>实时热点资讯</Text>
      </View>

      {error && newsList.length === 0 ? (
        renderError()
      ) : (
        <RefreshableList
        data={newsList}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onRefresh={handleRefresh}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        enableRefresh={true}
        enableLoadMore={true}
        customRefreshHeader={CustomRefreshHeader}
        refreshColors={['#ff6b6b', '#4ecdc4', '#45b7d1']}
        refreshTintColor={'#ff6b6b'}
        loadMoreText="上拉加载更多热门新闻"
        noMoreDataText="没有更多新闻了"
        loadingText="正在加载..."
        contentContainerStyle={styles.listContent}
      />
      )}
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    paddingVertical: 8,
  },
  itemContainer: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  item: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  cover: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  contentContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    lineHeight: 22,
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  hotLabel: {
    fontSize: 12,
    color: '#ff6b6b',
    fontWeight: '500',
  },
  timeLabel: {
    fontSize: 12,
    color: '#999',
  },
  rankContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ff6b6b',
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  separator: {
    height: 1,
    backgroundColor: 'transparent',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})

export default HotNewsList;
