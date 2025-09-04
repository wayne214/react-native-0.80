import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Animated,
  ActivityIndicator,
} from "react-native";

const HEADER_HEIGHT = 80;       // 下拉刷新头部高度
const TRIGGER_DISTANCE = 60;    // 触发刷新的阈值

export default function PullToRefresh({ data, renderItem, onRefresh }) {
  const [refreshing, setRefreshing] = useState(false);
  const [locked, setLocked] = useState(false); // 是否锁定头部
  const [refreshText, setRefreshText] = useState("下拉可以刷新");

  const scrollY = useRef(new Animated.Value(0)).current;

  const handleRelease = async (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;

    if (offsetY < -TRIGGER_DISTANCE && !refreshing) {
      setLocked(true);
      setRefreshing(true);
      setRefreshText("正在刷新...");

      try {
        await onRefresh?.();
        setRefreshText("刷新完成");
      } catch {
        setRefreshText("刷新失败");
      }

      setTimeout(() => {
        setRefreshing(false);
        setRefreshText("下拉可以刷新");
        setLocked(false);
      }, 1000);
    }
  };

  return (
      <View style={{ flex: 1 }}>
        <Animated.FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(_, i) => i.toString()}
            scrollEventThrottle={16}
            bounces={true}
            overScrollMode="always"
            // ✅ 这里锁定刷新头部
            contentInset={{ top: locked ? HEADER_HEIGHT : 0 }}
            contentOffset={{ y: locked ? -HEADER_HEIGHT : 0 }}
            onScrollEndDrag={handleRelease}
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
            )}
            ListHeaderComponent={
              <View style={[styles.header, { height: HEADER_HEIGHT }]}>
                {refreshing ? (
                    <ActivityIndicator />
                ) : (
                    <Text style={styles.text}>{refreshText}</Text>
                )}
              </View>
            }
        />
      </View>
  );
}

const styles = StyleSheet.create({
  header: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
  },
  text: {
    fontSize: 14,
    color: "#333",
  },
});
