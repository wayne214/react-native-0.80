import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setNewsList, setError } from '../store/newsSlice';
import { showLoading, hideLoading } from '../store/loadingSlice';

const ReduxExample: React.FC = () => {
  const dispatch = useDispatch();
  const { newsList, error } = useSelector((state: RootState) => state.news);
  const { isLoading, message } = useSelector((state: RootState) => state.loading);

  const handleSetNews = () => {
    const sampleNews = [
      {
        title: '示例新闻标题',
        id: '1',
        cover: 'https://example.com/image.jpg',
        timestamp: Date.now(),
        hot: 100,
        url: 'https://example.com/news/1',
        mobileUrl: 'https://example.com/news/1'
      }
    ];
    dispatch(setNewsList(sampleNews));
  };

  const handleSetError = () => {
    dispatch(setError('这是一个示例错误消息'));
  };

  const handleShowLoading = () => {
    dispatch(showLoading('正在加载示例数据...'));
  };

  const handleHideLoading = () => {
    dispatch(hideLoading());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redux状态管理示例</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>新闻状态:</Text>
        <Text>新闻数量: {newsList.length}</Text>
        {newsList.length > 0 && (
          <Text>第一条新闻: {newsList[0].title}</Text>
        )}
        <Button title="设置示例新闻" onPress={handleSetNews} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>错误状态:</Text>
        <Text>错误消息: {error || '无错误'}</Text>
        <Button title="设置错误" onPress={handleSetError} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>加载状态:</Text>
        <Text>是否加载中: {isLoading ? '是' : '否'}</Text>
        <Text>加载消息: {message}</Text>
        <Button title="显示加载" onPress={handleShowLoading} />
        <Button title="隐藏加载" onPress={handleHideLoading} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ReduxExample;