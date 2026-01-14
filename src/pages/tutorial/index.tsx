import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RefreshableList } from '../../component/list/RefreshableList';
import { CustomRefreshHeader } from '../../component/list/CustomRefreshHeader';

// 定义数据类型
interface TutorialItem {
  articleList: any[];
  author: string;
  children: any[];
  courseId: number;
  cover: string;
  desc: string;
  id: number;
  lisense: string;
  lisenseLink: string;
  name: string;
  order: number;
  parentChapterId: number;
  type: number;
  userControlSetTop: boolean;
  visible: number;
}

interface ApiResponse {
  data: TutorialItem[];
  errorCode: number;
  errorMsg: string;
}

const TutorialPage = () => {
  const navigation = useNavigation<any>();
  const [tutorials, setTutorials] = useState<TutorialItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getTutorials = async (isRefresh: boolean = false) => {
    if (isLoading && !isRefresh) return;

    setIsLoading(true);
    try {
      const response = await fetch('https://www.wanandroid.com/chapter/547/sublist/json');
      const result: ApiResponse = await response.json();

      if (result.errorCode === 0) {
        setTutorials(result.data);
      } else {
        Alert.alert('错误', result.errorMsg || '获取教程列表失败');
      }
    } catch (error) {
      console.error('获取教程列表失败:', error);
      Alert.alert('错误', '获取教程列表失败');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTutorials(true);
  }, []);

  const handleRefresh = async () => {
    await getTutorials(true);
  };

  const openTutorial = (tutorial: TutorialItem) => {
    // 导航到教程详情页面并传递教程ID
    navigation.navigate('TutorialDetailPage', { tutorialId: tutorial.id });
  };

  const renderTutorialItem = ({ item }: { item: TutorialItem }) => (
    <TouchableOpacity
      style={styles.tutorialItem}
      onPress={() => openTutorial(item)}
    >
      <View style={styles.tutorialRow}>
        {item.cover ? (
          <Image
            source={{ uri: item.cover }}
            style={styles.tutorialCover}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.tutorialCoverPlaceholder}>
            <Text style={styles.coverPlaceholderText}>📚</Text>
          </View>
        )}
        <View style={styles.tutorialContent}>
          <Text style={styles.tutorialTitle} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.tutorialDesc} numberOfLines={2}>
            {item.desc}
          </Text>
          <Text style={styles.tutorialAuthor}>
            作者: {item.author}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>📚 教程列表</Text>
        <Text style={styles.headerSubtitle}>WanAndroid 教程专区</Text>
      </View> */}

      <RefreshableList
        data={tutorials}
        renderItem={renderTutorialItem}
        keyExtractor={(item) => item.id.toString()}
        onRefresh={handleRefresh}
        hasMore={false}
        enableRefresh={true}
        enableLoadMore={false}
        customRefreshHeader={CustomRefreshHeader}
        refreshColors={['#ff6b6b', '#4ecdc4', '#45b7d1']}
        refreshTintColor={'#ff6b6b'}
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
  tutorialItem: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 10,
    borderRadius: 12,
    shadowColor: '#00f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tutorialTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    lineHeight: 22,
    marginBottom: 8,
  },
  tutorialLink: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  tutorialCover: {
    width: 80,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
  tutorialContent: {
    flex: 1,
  },
  tutorialDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
    marginBottom: 4,
  },
  tutorialAuthor: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  tutorialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  tutorialCoverPlaceholder: {
    width: 60,
    height: 100,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverPlaceholderText: {
    fontSize: 24,
  },
});

export default TutorialPage;