import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { WebView} from 'react-native-webview';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles"
// 定义路由参数类型
type NewsDetailRouteProp = RouteProp<{
  NewsDetail: {
    pageUrl: string;
    title: string;
  };
}, 'NewsDetail'>;

function NewsDetail ({ route }: { route: NewsDetailRouteProp }){
  const navigation = useNavigation();

  /* 2. Get the param */
  const { pageUrl, title } = route.params;

  useEffect(() => {
    // 获取当前主题名
    console.log("theme_name_:", UnistylesRuntime.themeName)

// 获取屏幕方向
    console.log("current_orientation_:", UnistylesRuntime.orientation)

    navigation.setOptions({
      title: title
    })
  }, [navigation, title]);

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
  }
});

export default NewsDetail;
