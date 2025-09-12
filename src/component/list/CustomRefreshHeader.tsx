import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface CustomRefreshHeaderProps {
  refreshing: boolean;
}

export const CustomRefreshHeader: React.FC<CustomRefreshHeaderProps> = ({ refreshing }) => {
  const spinValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (refreshing) {
      // 开始旋转动画
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      // 停止动画并重置
      spinValue.stopAnimation();
      spinValue.setValue(0);
    }
  }, [refreshing, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconContainer, { transform: [{ rotate: spin }] }]}>
        <Text style={styles.icon}>🔄</Text>
      </Animated.View>
      <Text style={styles.text}>
        {refreshing ? '正在刷新...' : '下拉刷新'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#f5f5f5',
  },
  iconContainer: {
    marginRight: 8,
  },
  icon: {
    fontSize: 20,
  },
  text: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});

export default CustomRefreshHeader;