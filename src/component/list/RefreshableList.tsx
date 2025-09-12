import React, { useState, useCallback, forwardRef, useImperativeHandle, useMemo } from 'react';
import {
  FlatList,
  RefreshControl,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatListProps,
  ViewStyle,
  TextStyle,
} from 'react-native';

// 列表组件的 Props 接口
interface RefreshableListProps<T> extends Omit<FlatListProps<T>, 'refreshControl' | 'onEndReached'> {
  // 数据源
  data: T[];
  // 渲染每一项的函数
  renderItem: ({ item, index }: { item: T; index: number }) => React.ReactElement;
  // 下拉刷新回调
  onRefresh?: () => Promise<void> | void;
  // 上拉加载更多回调
  onLoadMore?: () => Promise<void> | void;
  // 是否支持下拉刷新
  enableRefresh?: boolean;
  // 是否支持上拉加载
  enableLoadMore?: boolean;
  // 自定义下拉刷新头部组件
  customRefreshHeader?: React.ComponentType<{ refreshing: boolean }>;
  // 下拉刷新的颜色配置
  refreshColors?: string[];
  // 下拉刷新的tint颜色（iOS）
  refreshTintColor?: string;
  // 是否还有更多数据可加载
  hasMore?: boolean;
  // 加载更多时的文本
  loadMoreText?: string;
  // 没有更多数据时的文本
  noMoreDataText?: string;
  // 加载中的文本
  loadingText?: string;
  // 底部加载组件的样式
  footerStyle?: ViewStyle;
  // 底部文本样式
  footerTextStyle?: TextStyle;
  // 触发上拉加载的距离阈值
  onEndReachedThreshold?: number;
}

// 列表组件的 Ref 接口
export interface RefreshableListRef {
  // 手动触发刷新
  triggerRefresh: () => void;
  // 停止刷新状态
  stopRefresh: () => void;
  // 滚动到顶部
  scrollToTop: () => void;
  // 滚动到指定位置
  scrollToIndex: (index: number) => void;
}

// 默认的底部加载组件
const DefaultFooter = ({ 
  loading, 
  hasMore, 
  loadMoreText, 
  noMoreDataText, 
  loadingText,
  textStyle 
}: {
  loading: boolean;
  hasMore: boolean;
  loadMoreText: string;
  noMoreDataText: string;
  loadingText: string;
  textStyle?: TextStyle;
}) => {
  if (loading) {
    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color="#666" />
        <Text style={[styles.footerText, textStyle]}>{loadingText}</Text>
      </View>
    );
  }

  if (!hasMore) {
    return (
      <View style={styles.footerContainer}>
        <Text style={[styles.footerText, textStyle]}>{noMoreDataText}</Text>
      </View>
    );
  }

  return (
    <View style={styles.footerContainer}>
      <Text style={[styles.footerText, textStyle]}>{loadMoreText}</Text>
    </View>
  );
};

// 主要的列表组件
function RefreshableListComponent<T>(
  props: RefreshableListProps<T>,
  ref: React.Ref<RefreshableListRef>
) {
  const {
    data,
    renderItem,
    onRefresh,
    onLoadMore,
    enableRefresh = true,
    enableLoadMore = true,
    customRefreshHeader,
    refreshColors = ['#ff6b6b', '#4ecdc4', '#45b7d1'],
    refreshTintColor = '#ff6b6b',
    hasMore = true,
    loadMoreText = '上拉加载更多',
    noMoreDataText = '没有更多数据了',
    loadingText = '加载中...',
    footerStyle,
    footerTextStyle,
    onEndReachedThreshold = 0.1,
    ...flatListProps
  } = props;

  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // FlatList 的引用
  const flatListRef = React.useRef<FlatList<T>>(null);

  // 下拉刷新处理
  const handleRefresh = useCallback(async () => {
    if (!enableRefresh || !onRefresh) return;
    
    setRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error('刷新失败:', error);
    } finally {
      setRefreshing(false);
    }
  }, [enableRefresh, onRefresh]);

  // 上拉加载更多处理
  const handleLoadMore = useCallback(async () => {
    if (!enableLoadMore || !onLoadMore || !hasMore || loadingMore) return;
    
    setLoadingMore(true);
    try {
      await onLoadMore();
    } catch (error) {
      console.error('加载更多失败:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [enableLoadMore, onLoadMore, hasMore, loadingMore]);

  // 渲染底部组件
  const renderFooter = useCallback(() => {
    if (!enableLoadMore || data.length === 0) return null;
    
    return (
      <View style={[styles.footerWrapper, footerStyle]}>
        <DefaultFooter
          loading={loadingMore}
          hasMore={hasMore}
          loadMoreText={loadMoreText}
          noMoreDataText={noMoreDataText}
          loadingText={loadingText}
          textStyle={footerTextStyle}
        />
      </View>
    );
  }, [
    enableLoadMore, 
    data.length, 
    loadingMore, 
    hasMore, 
    loadMoreText, 
    noMoreDataText, 
    loadingText, 
    footerStyle, 
    footerTextStyle
  ]);

  // 优化的刷新控件 - 使用 useMemo 减少重复渲染
  const refreshControl = useMemo(() => {
    if (!enableRefresh) return undefined;
    
    return (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={handleRefresh}
        colors={customRefreshHeader ? ['transparent'] : refreshColors}
        tintColor={customRefreshHeader ? 'transparent' : refreshTintColor}
        progressViewOffset={customRefreshHeader ? 50 : 0}
      />
    );
  }, [enableRefresh, refreshing, handleRefresh, customRefreshHeader, refreshColors, refreshTintColor]);

  // 优化的自定义刷新头部渲染 - 使用 useMemo 避免不必要的重新创建
  const renderCustomHeader = useMemo(() => {
    if (!customRefreshHeader || !refreshing) return null;
    return React.createElement(customRefreshHeader, { refreshing });
  }, [customRefreshHeader, refreshing]);

  // 暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    triggerRefresh: () => {
      handleRefresh();
    },
    stopRefresh: () => {
      setRefreshing(false);
    },
    scrollToTop: () => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    },
    scrollToIndex: (index: number) => {
      flatListRef.current?.scrollToIndex({ index, animated: true });
    },
  }), [handleRefresh]);

  return (
    <View style={{ flex: 1 }}>
      {renderCustomHeader}
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        refreshControl={refreshControl}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={onEndReachedThreshold}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
        getItemLayout={undefined}
        {...flatListProps}
      />
    </View>
  );
}

// 样式定义
const styles = StyleSheet.create({
  footerWrapper: {
    paddingVertical: 20,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
});

// 使用 forwardRef 导出组件
export const RefreshableList = forwardRef(RefreshableListComponent) as <T>(
  props: RefreshableListProps<T> & { ref?: React.Ref<RefreshableListRef> }
) => React.ReactElement;

export default RefreshableList;