import React, { useState, useCallback, useRef } from 'react';
import {
    FlatList,
    RefreshControl,
    ActivityIndicator,
    View,
    Text,
    StyleSheet,
    Animated,
    Platform
} from 'react-native';

/**
 * 支持下拉刷新和上拉加载的列表组件
 * @param {Object} props - 组件属性
 * @param {Array} props.data - 列表数据
 * @param {Function} props.renderItem - 渲染列表项的函数
 * @param {Function} props.onRefresh - 下拉刷新回调函数
 * @param {Function} props.onLoadMore - 上拉加载更多回调函数
 * @param {boolean} props.refreshing - 刷新状态
 * @param {boolean} props.hasMore - 是否还有更多数据可加载
 * @param {boolean} props.loadingMore - 加载更多状态
 * @param {number} props.pageSize - 每页数据量
 * @param {Object} props.style - 容器样式
 * @param {Object} props.contentContainerStyle - 内容容器样式
 * @param {React.Component} props.ListEmptyComponent - 空列表组件
 * @param {React.Component} props.ListHeaderComponent - 列表头部组件
 * @param {React.Component} props.ListFooterComponent - 列表底部组件
 * @param {React.Component} props.CustomLoadingIndicator - 自定义加载指示器
 * @param {React.Component} props.CustomRefreshControl - 自定义刷新控件
 * @param {number} props.threshold - 触发加载更多的阈值（距离底部的像素）
 * @param {string} props.noMoreText - 没有更多数据时的提示文字
 * @param {string} props.loadingText - 加载中的提示文字
 */
const RefreshableList = ({
                             data = [],
                             renderItem,
                             onRefresh,
                             onLoadMore,
                             refreshing = false,
                             hasMore = true,
                             loadingMore = false,
                             pageSize = 10,
                             style,
                             contentContainerStyle,
                             ListEmptyComponent,
                             ListHeaderComponent,
                             ListFooterComponent,
                             CustomLoadingIndicator,
                             CustomRefreshControl,
                             threshold = 100,
                             noMoreText = '没有更多数据了',
                             loadingText = '加载中...',
                             ...flatListProps
                         }) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;

    // 处理下拉刷新
    const handleRefresh = useCallback(async () => {
        if (refreshing) return;

        setIsRefreshing(true);
        try {
            onRefresh && await onRefresh();
        } catch (error) {
            console.error('Refresh error:', error);
        } finally {
            setIsRefreshing(false);
        }
    }, [onRefresh, refreshing]);

    // 处理上拉加载更多
    const handleLoadMore = useCallback(() => {
        if (loadingMore || !hasMore || !onLoadMore) return;

        if (data.length >= pageSize) {
            onLoadMore();
        }
    }, [loadingMore, hasMore, onLoadMore, data.length, pageSize]);

    // 渲染底部组件
    const renderFooter = useCallback(() => {
        if (!hasMore && data.length > 0) {
            return (
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>{noMoreText}</Text>
                </View>
            );
        }

        if (loadingMore) {
            return (
                <View style={styles.footerContainer}>
                    {CustomLoadingIndicator ? (
                        <CustomLoadingIndicator />
                    ) : (
                        <>
                            <ActivityIndicator size="small" color="#999" />
                            <Text style={[styles.footerText, styles.loadingText]}>
                                {loadingText}
                            </Text>
                        </>
                    )}
                </View>
            );
        }

        return ListFooterComponent ? <ListFooterComponent /> : null;
    }, [
        hasMore,
        loadingMore,
        data.length,
        CustomLoadingIndicator,
        ListFooterComponent,
        noMoreText,
        loadingText
    ]);

    // 渲染空列表组件
    const renderEmptyComponent = useCallback(() => {
        if (ListEmptyComponent) {
            return React.isValidElement(ListEmptyComponent) ? (
                ListEmptyComponent
            ) : (
                <ListEmptyComponent />
            );
        }

        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>暂无数据</Text>
            </View>
        );
    }, [ListEmptyComponent]);

    // 渲染刷新控件
    const renderRefreshControl = useCallback(() => {
        if (CustomRefreshControl) {
            return React.isValidElement(CustomRefreshControl) ? (
                CustomRefreshControl
            ) : (
                <CustomRefreshControl
                    refreshing={isRefreshing || refreshing}
                    onRefresh={handleRefresh}
                />
            );
        }

        return (
            <RefreshControl
                refreshing={isRefreshing || refreshing}
                onRefresh={handleRefresh}
                colors={['#ff0000', '#00ff00', '#0000ff']}
                progressBackgroundColor="#ffffff"
                tintColor="#007AFF"
                title="下拉刷新"
                titleColor="#666"
            />
        );
    }, [CustomRefreshControl, isRefreshing, refreshing, handleRefresh]);

    return (
        <Animated.FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) =>
                item?.id ? item.id.toString() : `item-${index}`
            }
            refreshControl={renderRefreshControl()}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={threshold / 1000} // 转换为比例值
            ListEmptyComponent={renderEmptyComponent}
            ListHeaderComponent={ListHeaderComponent}
            ListFooterComponent={renderFooter}
            contentContainerStyle={[
                styles.contentContainer,
                data.length === 0 && styles.emptyContentContainer,
                contentContainerStyle
            ]}
            style={[styles.container, style]}
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
            {...flatListProps}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
    },
    emptyContentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerContainer: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    footerText: {
        fontSize: 14,
        color: '#999',
        marginLeft: 8,
    },
    loadingText: {
        marginLeft: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
    },
});

export default RefreshableList;
