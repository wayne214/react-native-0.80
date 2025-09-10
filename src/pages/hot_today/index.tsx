import React, {useCallback, useEffect, useState} from 'react';
import { View, Text, Image, StyleSheet, Pressable, RefreshControl, ActivityIndicator, FlatList } from 'react-native';
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { FlashList } from "@shopify/flash-list";
import axios from 'axios';
import { LoadingManager } from '../../component/loading/LoadingManager';
import { PullToRefresh } from '@sdcx/pull-to-refresh'
import { CustomPullToRefreshHeader } from '../../component/refresh/CustomPullToRefreshHeader';

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
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    getNewsData();
  }, []);

  const getNewsData = () => {
    // LoadingManager.setRef(LoadingManager.show("数据加载中..."));

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

  const gotoDetail = useCallback((url: string, title: string) => {
    navigation.navigate("Details", {pageUrl: url, title: title})
  }, [navigation])

  const renderItem = useCallback(({ item }: {item: NewsItem} ) => {
    return (
      <Pressable onPress={()=>gotoDetail(item.mobileUrl, item.title)}>
        <View style={styles.item}>
          <Image source={{uri: item.cover}} style={styles.cover}/>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode={'tail'}>{item.title}</Text>
        </View>
      </Pressable>
    )
  }, [gotoDetail])

  const gotoChartsPage = () => {
    // navigation.navigate("ChartsPage")
  }

  return (
    <View style={{flex: 1}}>
      <Pressable onPress={gotoChartsPage}>
        <Text>图表组件</Text>
      </Pressable>
      <FlatList
        nestedScrollEnabled
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true)
              getNewsData()
            }}
          />
        }
        data={newsList}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id}
      />
    </View>


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
    fontSize: 16,
    marginBottom: 8,
    marginLeft: 8,
    flex:1,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
})

export default HotNewsList;
