// src/pages/auth/FavoritesPage.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromFavorites } from '../../store/userSlice';
import { RootState } from '../../store';
import { useNavigation } from '@react-navigation/native';

const FavoritesPage = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch();
  const { favorites, currentUser } = useSelector((state: RootState) => state.user);

  // 模拟新闻数据 - 在实际应用中，这些数据应该从API或状态管理中获取
  const getFavoriteNews = () => {
    // 这里只是模拟数据，实际应用中应从API获取对应的新闻详情
    return favorites.map((id, index) => ({
      id,
      title: `收藏的新闻 ${index + 1}`,
      description: `这是收藏的第 ${index + 1} 条新闻的摘要...`,
      date: new Date().toLocaleDateString(),
    }));
  };

  const handleRemoveFavorite = (newsId: string) => {
    Alert.alert(
      '取消收藏',
      '确定要取消收藏这条新闻吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: () => {
            dispatch(removeFromFavorites(newsId));
          },
        },
      ]
    );
  };

  const renderNewsItem = ({ item }: { item: any }) => (
    <View style={styles.newsItem}>
      <View style={styles.newsContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFavorite(item.id)}
      >
        <Text style={styles.removeButtonText}>取消收藏</Text>
      </TouchableOpacity>
    </View>
  );

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>请先登录以查看收藏内容</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>前往登录</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>暂无收藏内容</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={getFavoriteNews()}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsContent: {
    flex: 1,
  },
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
  removeButton: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default FavoritesPage;
