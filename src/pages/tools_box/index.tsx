import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';

const ToolsHome = () => {
  const navigation = useNavigation();
  const gotoToolPage  = useCallback(() => {
    navigation.navigate("ToolsPage", {})
  },[])
  return (
    <View style={styles.container}>
      <Pressable onPress={gotoToolPage}>
        <Text style={styles.buttonText}>日历组件</Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20
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
    borderRadius: 10,
    alignContent: 'center',
  }
});

export default ToolsHome
