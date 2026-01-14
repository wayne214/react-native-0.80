import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import { RefreshableList } from '../../component/list/RefreshableList';
import { CustomRefreshHeader } from '../../component/list/CustomRefreshHeader';
import { RouteProp, useNavigation } from '@react-navigation/native';

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

type TutorialDetailRouteProp = RouteProp<{
  TutorialDetailPage: { tutorialId: number };
  WebViewPage: { url: string; title: string };
}, 'TutorialDetailPage'>;

interface TutorialDetailProps {
  route: TutorialDetailRouteProp;
}

const TutorialDetailPage: React.FC<TutorialDetailProps> = ({ route }) => {
  const navigation = useNavigation<any>();
  const { tutorialId } = route.params;
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const getTutorialArticles = async (page: number = 0, isRefresh: boolean = false) => {
    if (isLoading && !isRefresh) return;

    setIsLoading(true);
    try {
      const response = await fetch(`https://wanandroid.com/article/list/${page}/json?cid=${tutorialId}&page_size=10&order_type=1`);
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
      } else {
        Alert.alert('错误', result.errorMsg || '获取教程文章列表失败');
      }
    } catch (error) {
      console.error('获取教程文章列表失败:', error);
      Alert.alert('错误', '获取教程文章列表失败');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTutorialArticles(0, true);
  }, [tutorialId]);

  const handleRefresh = async () => {
    await getTutorialArticles(0, true);
  };

  const loadMore = async () => {
    if (hasMore) {
      await getTutorialArticles(currentPage + 1);
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

  const renderArticleItem = ({ item }: { item: Article }) => (
    <TouchableOpacity
      style={styles.articleItem}
      onPress={() => openArticle(item)}
    >
      <Text style={styles.articleTitle} numberOfLines={2}>
        {item.title.replace(/<[\\s\\S]*?>/g, '')}
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
        <Text style={styles.headerTitle}>📚 教程详情</Text>
        <Text style={styles.headerSubtitle}>教程 ID: {tutorialId}</Text>
      </View> */}

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
  webViewContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webView: {
    flex: 1,
  },
  webViewHeader: {
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
  webViewTitle: {
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
});

export default TutorialDetailPage;