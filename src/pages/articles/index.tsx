import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { RefreshableList } from '../../component/list/RefreshableList';
import { CustomRefreshHeader } from '../../component/list/CustomRefreshHeader';
import { useNavigation } from '@react-navigation/native';

// 定义导航参数类型
type RootStackParamList = {
  TutorialPage: undefined;
  // 添加其他可能的导航目标
};

// 定义数据类型
interface Article {
  id: number;
  title: string;
  link: string;
  author: string;
  chapterName: string;
  publishTime: number;
  niceDate: string;
  superChapterName: string;
}

interface ApiResponse {
  data: {
    datas: Article[];
    curPage: number;
    pageCount: number;
    total: number;
  };
  errorCode: number;
  errorMsg: string;
}

const ArticlesPage = () => {
  const navigation = useNavigation<any>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const getArticles = async (page: number = 0, isRefresh: boolean = false) => {
    if (isLoading && !isRefresh) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`https://www.wanandroid.com/article/list/${page}/json?page_size=10`);
      const result: ApiResponse = await response.json();
      
      if (result.errorCode === 0) {
        if (isRefresh) {
          setArticles(result.data.datas);
          setCurrentPage(0);
          setHasMore(result.data.curPage < result.data.pageCount - 1);
        } else {
          setArticles(prev => [...prev, ...result.data.datas]);
          setCurrentPage(page);
          setHasMore(result.data.curPage < result.data.pageCount - 1);
        }
      }
    } catch (error) {
      console.error('获取文章列表失败:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    getArticles(0, true);
  }, []);
  
  const handleRefresh = async () => {
    await getArticles(0, true);
  };
  
  const loadMore = async () => {
    if (hasMore) {
      await getArticles(currentPage + 1);
    }
  };
  
  const openArticle = (article: Article) => {
    // 检查链接是否为恶意链接（如淘宝等）
    const maliciousDomains = ['taobao.com', 'tmall.com', 'alicdn.com'];
    const isMalicious = maliciousDomains.some(domain => article.link.includes(domain));
    
    if (isMalicious) {
      Alert.alert('警告', '检测到可能的恶意链接，已阻止跳转');
      return;
    }
    
    // 导航到新的 WebView 页面
    navigation.navigate('WebViewPage', { 
      url: article.link,
      title: article.title.replace(/<[\s\S]*?>/g, '')
    });
  };
  
  const openHarmonyPage = () => {
    // 导航到鸿蒙专栏的 WebView 页面
    navigation.navigate('WebViewPage', { 
      url: 'https://wanandroid.com/harmony/index',
      title: '鸿蒙专栏'
    });
  };
  
  const openTutorialPage = () => {
    // 导航到教程页面
    navigation.navigate('TutorialPage');
  };
  
  const renderArticleItem = ({ item }: { item: Article }) => (
    <TouchableOpacity 
      style={styles.articleItem}
      onPress={() => openArticle(item)}
    >
      <Text style={styles.articleTitle} numberOfLines={2}>
        {item.title.replace(/<[\s\S]*?>/g, '')}
      </Text>
      <View style={styles.articleMeta}>
        <Text style={styles.articleAuthor}>{item.author}</Text>
        <Text style={styles.articleTime}>{item.niceDate}</Text>
      </View>
      <Text style={styles.articleCategory}>
        {item.superChapterName} {'>'} {item.chapterName}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>📚 技术文章</Text>
        <Text style={styles.headerSubtitle}>WanAndroid 技术文章</Text>
      </View> */}
      
      {/* 入口标签流式布局 */}
      <View style={styles.entriesContainer}>
        <TouchableOpacity 
          style={styles.entryTag}
          onPress={openHarmonyPage}
        >
          <Text style={styles.entryTagText}>鸿蒙专栏</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.entryTag}
          onPress={openTutorialPage}
        >
          <Text style={styles.entryTagText}>教程入口</Text>
        </TouchableOpacity>
      </View>
      
      <RefreshableList
        data={articles}
        renderItem={renderArticleItem}
        keyExtractor={(item) => item.id.toString()}
        onRefresh={handleRefresh}
        onLoadMore={loadMore}
        hasMore={hasMore}
        enableRefresh={true}
        enableLoadMore={true}
        customRefreshHeader={CustomRefreshHeader}
        refreshColors={['#ff6b6b', '#4ecdc4', '#45b7d1']}
        refreshTintColor={'#ff6b6b'}
        loadMoreText="上拉加载更多文章"
        noMoreDataText="没有更多文章了"
        loadingText="正在加载..."
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

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
  articleItem: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    lineHeight: 22,
    marginBottom: 8,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  articleAuthor: {
    fontSize: 12,
    color: '#ff6b6b',
    fontWeight: '500',
  },
  articleTime: {
    fontSize: 12,
    color: '#999',
  },
  articleCategory: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  harmonyEntry: {
    backgroundColor: '#FF6B6B',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  harmonyEntryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  tutorialEntry: {
    backgroundColor: '#4ecdc4',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tutorialEntryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  entriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  entryTag: {
    backgroundColor: '#4ecdc4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  entryTagText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
});

export default ArticlesPage;