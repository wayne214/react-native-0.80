import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { RefreshableList, RefreshableListRef } from './RefreshableList';
import { CustomRefreshHeader } from './CustomRefreshHeader';

// 示例数据接口
interface ExampleItem {
  id: string;
  title: string;
  description: string;
  image?: string;
}

export const RefreshableListExample: React.FC = () => {
  const [data, setData] = useState<ExampleItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // 列表组件的引用
  const listRef = useRef<RefreshableListRef>(null);

  // 模拟获取数据的函数
  const fetchData = async (pageNum: number, isRefresh: boolean = false): Promise<ExampleItem[]> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟分页数据
    const newData: ExampleItem[] = Array.from({ length: 10 }, (_, index) => ({
      id: `${pageNum}-${index}`,
      title: `标题 ${pageNum}-${index + 1}`,
      description: `这是第 ${pageNum} 页的第 ${index + 1} 条数据描述`,
      image: `https://picsum.photos/100/100?random=${pageNum * 10 + index}`,
    }));
    
    // 模拟没有更多数据的情况
    if (pageNum > 3) {
      setHasMore(false);
      return [];
    }
    
    return newData;
  };

  // 下拉刷新处理
  const handleRefresh = async () => {
    console.log('开始刷新...');
    try {
      const newData = await fetchData(1, true);
      setData(newData);
      setPage(2);
      setHasMore(true);
      console.log('刷新完成');
    } catch (error) {
      console.error('刷新失败:', error);
    }
  };

  // 上拉加载更多处理
  const handleLoadMore = async () => {
    if (!hasMore) return;
    
    console.log('开始加载更多...');
    try {
      const newData = await fetchData(page);
      setData(prevData => [...prevData, ...newData]);
      setPage(prevPage => prevPage + 1);
      console.log('加载更多完成');
    } catch (error) {
      console.error('加载更多失败:', error);
    }
  };

  // 渲染列表项
  const renderItem = ({ item, index }: { item: ExampleItem; index: number }) => (
    <Pressable style={styles.itemContainer}>
      <View style={styles.item}>
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.itemImage} />
        )}
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
          <Text style={styles.itemIndex}>索引: {index}</Text>
        </View>
      </View>
    </Pressable>
  );

  // 手动触发刷新的按钮
  const handleManualRefresh = () => {
    listRef.current?.triggerRefresh();
  };

  // 滚动到顶部的按钮
  const handleScrollToTop = () => {
    listRef.current?.scrollToTop();
  };

  return (
    <View style={styles.container}>
      {/* 顶部操作按钮 */}
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={handleManualRefresh}>
          <Text style={styles.buttonText}>手动刷新</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleScrollToTop}>
          <Text style={styles.buttonText}>回到顶部</Text>
        </Pressable>
      </View>

      {/* 使用封装的列表组件 */}
      <RefreshableList
        ref={listRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onRefresh={handleRefresh}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        enableRefresh={true}
        enableLoadMore={true}
        // 使用自定义刷新头部
        customRefreshHeader={CustomRefreshHeader}
        // 自定义底部加载文本
        loadMoreText="上拉查看更多"
        noMoreDataText="已经到底了～"
        loadingText="努力加载中..."
        // 自定义样式
        contentContainerStyle={styles.listContent}
        footerStyle={styles.customFooter}
        footerTextStyle={styles.customFooterText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    paddingVertical: 8,
  },
  itemContainer: {
    marginHorizontal: 16,
    marginVertical: 4,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  itemIndex: {
    fontSize: 12,
    color: '#999',
  },
  customFooter: {
    backgroundColor: '#f8f8f8',
    marginHorizontal: 16,
    borderRadius: 8,
  },
  customFooterText: {
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default RefreshableListExample;