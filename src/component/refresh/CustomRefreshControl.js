import React, { useState } from 'react';
import {
  RefreshControl,
} from 'react-native';

const CustomRefreshControl = ({ refreshing, onRefresh }) => {
  const [refreshState, setRefreshState] = useState("下拉可以刷新");

  const handleRefresh = async () => {
    setRefreshState("正在刷新...");
    try {
      await onRefresh();
      setRefreshState("刷新完成");
      setTimeout(() => setRefreshState("下拉可以刷新"), 1000);
    } catch (e) {
      setRefreshState("刷新失败");
      setTimeout(() => setRefreshState("下拉可以刷新"), 1000);
    }
  };

  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
      tintColor="#666" // iOS loading 颜色
      colors={["#ff0000", "#00ff00", "#0000ff"]} // Android loading 颜色
      title={refreshState}
      titleColor="#333"
    />
  );
};

export default CustomRefreshControl;
