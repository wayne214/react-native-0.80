// src/pages/auth/HistoryPage.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {useNavigation} from '@react-navigation/native';

const HistoryPage = () => {
  const navigation = useNavigation()
  const { history, currentUser } = useSelector((state: RootState) => state.user);

  // 模拟历史新闻数据 - 在实际应用中，这些数据应该从API或状态管理中获取
  const getHistoryNews = () => {
    // 这里只是模拟数据，实际应用中应从API获取对应的新闻详情
    return history.map((id, index) => ({
      id,
      title: `浏览过的新闻 ${index + 1}`,
      description: `这是浏览过的第 ${index + 1} 条新闻的摘要...`,
      date: new Date(Date.now() - index * 3600000).toLocaleString(), // 模拟不同时间
    }));
  };

  const renderNewsItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.newsItem}>
      <View style={styles.newsContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>请先登录以查看浏览历史</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>前往登录</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (history.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>暂无浏览历史</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={getHistoryNews()}
        renderItem={renderNewsItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  newsItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  newsContent: {},
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});

export default HistoryPage;
