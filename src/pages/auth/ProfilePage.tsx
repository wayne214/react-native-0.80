// src/pages/auth/ProfilePage.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { logout, addToFavorites, removeFromFavorites, addToHistory } from '../../store/userSlice';
import { RootState } from '../../store';
import { useNavigation } from '@react-navigation/native';

const ProfilePage = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { currentUser, favorites, history } = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    Alert.alert(
      '确认退出',
      '确定要退出登录吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: async () => {
            // 先dispatch logout action
            dispatch(logout());

            // 导航到登录页
            navigation.navigate('Login');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {currentUser?.avatar ? (
            <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.defaultAvatar}>
              <Text style={styles.avatarText}>
                {currentUser?.username?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.username}>{currentUser?.username}</Text>
        <Text style={styles.email}>{currentUser?.email}</Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.optionText}>编辑资料</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate('Favorites', { favorites })}
        >
          <Text style={styles.optionText}>我的收藏 ({favorites.length})</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, styles.lastOption]}
          onPress={() => navigation.navigate('History' as never, { history })}
        >
          <Text style={styles.optionText}>浏览历史 ({history.length})</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Settings' as never)}>
          <Text style={styles.optionText}>设置</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>退出登录</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 10,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  defaultAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  arrow: {
    fontSize: 18,
    color: '#ccc',
  },
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 15,
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfilePage;
