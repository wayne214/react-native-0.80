import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { WebView} from 'react-native-webview';
import { RouteProp, useNavigation } from '@react-navigation/native';
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
