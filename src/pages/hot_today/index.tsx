import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, Pressable, RefreshControl, ActivityIndicator} from 'react-native';
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { FlashList } from "@shopify/flash-list";
import axios from 'axios';
import { LoadingManager } from '../../component/loading/LoadingManager';
import CustomRefreshControl from '../../component/refresh/CustomRefreshControl';
import PullToRefresh from '../../component/refresh/PullToRefresh';
import RefreshableList from "../../component/refresh/RefreshableList";

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

  const [data, setData] = useState([]);
  const [newsList, setNewsList] = useState<NewsItem[]>([])
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  useEffect(() => {
    getNewsData();
  }, []);

  const getNewsData = () => {
    setRefreshing(true);
    LoadingManager.setRef(LoadingManager.show("数据加载中..."));

    axios.get(NEWS_API)
      .then(function (response) {
        // handle success
        console.log(response);
        if(response.data.code === 200) {
            setRefreshing(false);
            LoadingManager.hide();
          if(response.data.data.length > 0) {
            setNewsList(response.data.data);
          }
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        LoadingManager.hide();
      })
      .finally(function () {
        // always executed
        LoadingManager.hide();
      });
  }

  // 模拟加载数据
  const loadData = async (pageNum, isRefresh = false) => {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newData = Array.from({ length: 10 }, (_, i) => ({
      id: (pageNum - 1) * 10 + i + 1,
      title: `项目 ${(pageNum - 1) * 10 + i + 1}`,
      description: `这是第 ${(pageNum - 1) * 10 + i + 1} 个项目的描述`
    }));

    return newData;
  };

  // 下拉刷新
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const newData = await loadData(1, true);
      setData(newData);
      setPage(1);
      setHasMore(true);
    } catch (error) {
      console.error('刷新失败:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // 上拉加载更多
  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const newData = await loadData(nextPage);

      if (newData.length > 0) {
        setData(prev => [...prev, ...newData]);
        setPage(nextPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('加载更多失败:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [page, loadingMore, hasMore]);

  // const renderItem = ({ item }: {item: NewsItem} ) => {
  //   return (
  //     <Pressable onPress={()=>gotoDetail(item.mobileUrl, item.title)}>
  //       <View style={styles.item}>
  //         <Image source={{uri: item.cover}} style={styles.cover}/>
  //         <Text style={styles.title}>{item.title}</Text>
  //       </View>
  //     </Pressable>
  //   )
  // }

  const gotoDetail = (url: string, title: string) => {
    navigation.navigate("Details", {pageUrl: url, title: title})
  }

  // 自定义加载指示器
  const CustomLoader = () => (
      <ActivityIndicator size="large" color="#007AFF" />
  );

  // 渲染列表项
  const renderItem = useCallback(({ item }) => (
      <View style={styles.item}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
  ), []);

  return (
      <RefreshableList
          data={data}
          renderItem={renderItem}
          onRefresh={handleRefresh}
          onLoadMore={handleLoadMore}
          refreshing={refreshing}
          loadingMore={loadingMore}
          hasMore={hasMore}
          pageSize={10}
          CustomLoadingIndicator={CustomLoader}
          contentContainerStyle={styles.listContent}
          // 其他自定义配置
          threshold={50}
          noMoreText="已经到底了"
          loadingText="正在加载更多..."
      />


  // <FlashList
  //     data={newsList}
  //     renderItem={renderItem}
  //     // onRefresh={getNewsData}
  //     keyExtractor={(item) => item.id}
  //     refreshControl={
  //       <RefreshControl
  //       tintColor="#666" // iOS loading 颜色
  //       colors={["#ff0000", "#00ff00", "#0000ff"]} // Android loading 颜色
  //       refreshing={refreshing}
  //       onRefresh={onRefresh}
  //       />
  //     }
  //   />
    // <PullToRefresh
    //   data={newsList}
    //   renderItem={renderItem}
    //   onRefresh={getNewsData}
    // />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: '#f9c2e2e2e2',
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row'
  },
  cover: {
    width: 60,
    height: 60,
  },
  listContent: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
})

export default HotNewsList;
