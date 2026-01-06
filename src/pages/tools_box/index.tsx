import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';

const ToolsHome = () => {
  const navigation = useNavigation();

  const gotoCalendarPage  = useCallback(() => {
    navigation.navigate("CalendarPage", {})
  },[navigation])

  const gotoVideoPage  = useCallback(() => {
    navigation.navigate("VideoPage", {})
  },[navigation])

  const gotoChartPage  = useCallback(() => {
    navigation.navigate("ChartsPage", {})
  },[navigation])

  return (
    <View style={styles.container}>
      <Pressable onPress={gotoCalendarPage}>
        <Text style={styles.buttonText}>日历组件</Text>
      </Pressable>
      <Pressable onPress={gotoVideoPage}>
        <Text style={styles.buttonText}>视频组件</Text>
      </Pressable>
      <Pressable onPress={gotoChartPage}>
        <Text style={styles.buttonText}>图表组件</Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    backgroundColor : 'royalblue',
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 10,
    borderRadius: 10,
    alignContent: 'center',
  }
});

export default ToolsHome
