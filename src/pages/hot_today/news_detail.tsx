import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, TouchableOpacity } from 'react-native';
import { WebView} from 'react-native-webview';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";
import { useDispatch, useSelector } from 'react-redux';
import { addToFavorites, removeFromFavorites, addToHistory } from '../../store/userSlice';
import { RootState } from '../../store';

// 定义路由参数类型
type NewsDetailRouteProp = RouteProp<{
  NewsDetail: {
    pageUrl: string;
    title: string;
    newsId?: string; // 添加新闻ID参数
  };
}, 'NewsDetail'>;

function NewsDetail (){
  const navigation = useNavigation();
  const route = useRoute<NewsDetailRouteProp>();
  const dispatch = useDispatch();
  const { isAuthenticated, favorites } = useSelector((state: RootState) => state.user);
  
  const { pageUrl, title, newsId } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // 检查该新闻是否已被收藏
    if (newsId && favorites.includes(newsId)) {
      setIsFavorite(true);
    }
    
    // 添加到浏览历史
    if (newsId && isAuthenticated) {
      dispatch(addToHistory(newsId));
    }
    
    // 获取当前主题名
    console.log("theme_name_:", UnistylesRuntime.themeName)

    // 获取屏幕方向
    console.log("current_orientation_:", UnistylesRuntime.orientation)

    // 设置导航选项，包括收藏按钮
    navigation.setOptions({
      title: title,
      headerRight: () => (
        isAuthenticated && newsId ? (
          <TouchableOpacity 
            style={styles.favoriteButton} 
            onPress={toggleFavorite}
          >
            <Text style={{ fontSize: 24, color: isFavorite ? '#FFD700' : '#000' }}>
              {isFavorite ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        ) : null
      ),
    })
  }, [navigation, title, isFavorite, isAuthenticated, newsId, favorites]);

  const toggleFavorite = () => {
    if (!isAuthenticated) {
      // 如果未登录，引导用户登录
      navigation.navigate('Login' as never);
      return;
    }
    
    if (newsId) {
      if (isFavorite) {
        dispatch(removeFromFavorites(newsId));
        setIsFavorite(false);
      } else {
        dispatch(addToFavorites(newsId));
        setIsFavorite(true);
      }
    }
  };

  return (
    <View style={styles.container}>
      <WebView source={{uri: pageUrl}} style={styles.webContainer}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webContainer: {
    flex: 1
  },
  favoriteButton: {
    marginRight: 15,
  }
});

export default NewsDetail;
