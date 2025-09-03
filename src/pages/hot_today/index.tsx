import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import {
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { FlashList } from "@shopify/flash-list";
import axios from 'axios';
import { LoadingManager } from '../../component/loading/LoadingManager';

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
  useEffect(() => {
    getNewsData();
  }, []);

  const getNewsData = () => {
    LoadingManager.show("数据加载中...");
    axios.get(NEWS_API)
      .then(function (response) {
        // handle success
        console.log(response);
        if(response.data.code === 200) {
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

  const renderItem = ({ item }: {item: NewsItem} ) => {
    return (
      <Pressable onPress={()=>gotoDetail(item.mobileUrl, item.title)}>
        <View style={styles.item}>
          <Image source={{uri: item.cover}} style={styles.cover}/>
          <Text style={styles.title}>{item.title}</Text>
        </View>
      </Pressable>
    )
  }

  const gotoDetail = (url: string, title: string) => {
    navigation.navigate("Details", {pageUrl: url, title: title})
  }

  return (
    <FlashList
      data={newsList}
      renderItem={renderItem}
      onRefresh={getNewsData}
      keyExtractor={(item) => item.id}
    />
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
  title: {
    marginLeft: 10
  }
})

export default HotNewsList;
