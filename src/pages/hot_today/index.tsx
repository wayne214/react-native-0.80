import React, {useCallback, useEffect, useState} from 'react';
import { View, Text, Image, StyleSheet, Pressable, Dimensions } from 'react-native';
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import axios from 'axios';
import { LoadingManager } from '../../component/loading/LoadingManager';
import { RefreshableList } from '../../component/list/RefreshableList';
import { CustomRefreshHeader } from '../../component/list/CustomRefreshHeader';

const NEWS_API = "https://api-hot.imsyy.top/toutiao"


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

const HotNewsList = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [newsList, setNewsList] = useState<NewsItem[]>([])
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  useEffect(() => {
    getNewsData(1, true);
  }, []);

  const getNewsData = async (page: number = 1, isRefresh: boolean = false) => {
    try {
      const response = await axios.get(`${NEWS_API}?page=${page}`);
      
      if(response.data.code === 200) {
        const newData = response.data.data || [];
        
        if (isRefresh) {
          // 刷新时替换数据
          setNewsList(newData);
          setCurrentPage(2);
          setHasMore(newData.length > 0);
        } else {
          // 加载更多时追加数据
          setNewsList(prevList => [...prevList, ...newData]);
          setCurrentPage(page + 1);
          setHasMore(newData.length > 0);
        }
        
        LoadingManager.hide();
      }
    } catch (error) {
      console.log(error);
      LoadingManager.hide();
    }
  }

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

  const renderItem = useCallback(({ item, index }: {item: NewsItem, index: number} ) => {
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
          />
          <View style={styles.contentContainer}>
            <Text style={styles.title} numberOfLines={2} ellipsizeMode={'tail'}>
              {item.title}
            </Text>
            <View style={styles.metaContainer}>
              <Text style={styles.hotLabel}>🔥 热度: {item.hot}</Text>
              <Text style={styles.timeLabel}>
                {new Date(item.timestamp * 1000).toLocaleDateString('zh-CN')}
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

  const gotoChartsPage = () => {
    // navigation.navigate("ChartsPage")
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔥 今日热闻</Text>
        <Text style={styles.headerSubtitle}>实时热点资讯</Text>
      </View>
      
      <RefreshableList
        data={newsList}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id + index}
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
})

export default HotNewsList;
