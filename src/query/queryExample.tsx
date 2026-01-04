import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// 示例API函数
const fetchExampleData = async (): Promise<string> => {
  // 模拟API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`示例数据 - ${new Date().toLocaleTimeString()}`);
    }, 1000);
  });
};

const QueryExample: React.FC = () => {
  const queryClient = useQueryClient();

  // 使用TanStack Query获取数据
  const {
    data,
    isLoading,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['exampleData'],
    queryFn: fetchExampleData,
    staleTime: 30000, // 30秒内数据被认为是新鲜的
    retry: 1,
  });

  const handleInvalidate = () => {
    // 使缓存数据失效，强制重新获取
    queryClient.invalidateQueries({ queryKey: ['exampleData'] });
  };

  const handleSetData = () => {
    // 手动设置数据
    queryClient.setQueryData(['exampleData'], `手动设置的数据 - ${new Date().toLocaleTimeString()}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TanStack Query 示例</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>数据状态:</Text>
        {isLoading ? (
          <Text>加载中...</Text>
        ) : error ? (
          <Text style={styles.errorText}>错误: {(error as Error).message}</Text>
        ) : (
          <Text>数据: {data}</Text>
        )}
        
        {isFetching && !isLoading && <Text style={styles.fetchingText}>刷新中...</Text>}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="刷新数据" onPress={() => refetch()} disabled={isLoading} />
        <Button title="使缓存失效" onPress={handleInvalidate} />
        <Button title="手动设置数据" onPress={handleSetData} />
      </View>

      <View style={styles.infoContainer}>
        <Text>缓存状态信息:</Text>
        <Text>是否加载中: {isLoading ? '是' : '否'}</Text>
        <Text>是否正在获取: {isFetching ? '是' : '否'}</Text>
        <Text>是否有错误: {error ? '是' : '否'}</Text>
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
  errorText: {
    color: 'red',
  },
  fetchingText: {
    color: 'blue',
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default QueryExample;