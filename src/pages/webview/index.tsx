import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 定义导航参数类型
export type RootStackParamList = {
  WebViewPage: { url: string; title: string };
};

// 定义路由参数类型
type WebViewPageRoute = RouteProp<RootStackParamList, 'WebViewPage'>;

interface WebViewPageProps {
  route: WebViewPageRoute;
}

const WebViewPage: React.FC<WebViewPageProps> = ({ route }) => {
  const navigation = useNavigation<any>();
  const { url, title } = route.params;
  const [showCustomHeader, setShowCustomHeader] = useState(true);

  const handleNavigationStateChange = (navState: any) => {
    // 拦截恶意跳转
    const maliciousDomains = ['taobao.com', 'tmall.com', 'alicdn.com'];
    const isMalicious = maliciousDomains.some(domain => navState.url.includes(domain));
    if (isMalicious) {
      Alert.alert('警告', '检测到可能的恶意链接，已阻止跳转');
      navigation.goBack();
      return;
    }
    
    // 检测 URL 是否包含自带头部的标识，如果是则隐藏自定义头部
    // 这里可以根据实际需求定义哪些 URL 应该隐藏自定义头部
    // 例如：如果 URL 包含某些关键词表示该页面已经有自己的头部
    const urlsThatHaveOwnHeader = ['/mobile', '/wap', '/m.', 'm/']; // 示例 URL 片段，移动版页面通常有自己的头部
    const shouldHideCustomHeader = urlsThatHaveOwnHeader.some(path => navState.url.includes(path));
    
    // 或者根据域名判断，例如某些特定网站可能有自己的头部
    const ownHeaderDomains = ['taobao.com', 'tmall.com', 'jd.com', 'weibo.cn', 'wap.', '.m.']; // 示例域名
    const hasOwnHeaderDomain = ownHeaderDomains.some(domain => navState.url.includes(domain));
    
    setShowCustomHeader(!shouldHideCustomHeader && !hasOwnHeaderDomain);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
            {true && (
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={styles.backButtonText}>← 返回</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{title || '网页详情'}</Text>
                <View style={styles.placeholder}></View>
            </View>
            )}
            <WebView
            source={{ uri: url }}
            style={styles.webView}
            onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                Alert.alert('错误', `网页加载失败: ${nativeEvent.description}`);
            }}
            onHttpError={(event) => {
                if (event.nativeEvent.statusCode >= 400) {
                Alert.alert('错误', `网页加载失败: ${event.nativeEvent.statusCode}`);
                }
            }}
            onNavigationStateChange={handleNavigationStateChange}
            />
        </View>
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 16,
  },
  placeholder: {
    width: 60,
  },
  webView: {
    flex: 1,
  },
});

export default WebViewPage;