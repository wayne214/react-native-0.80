import '../../global.css'
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { z } from 'zod';
import { useCounterStore } from './useCounterStore.ts';
import ErrorBoundary from "react-native-error-boundary";
import ComponentWithError from "../ComponentWithError.tsx";
import {useState} from "react";

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  age: z.number().optional(),
});

function Counter() {
  const { count, inc, dec } = useCounterStore()
  const [showErrorBoundary, setShowErrorBoundary] = useState(false);

  const checkError = () => {
    setShowErrorBoundary(true)
   }

  const checkData = () => {
    const result = UserSchema.safeParse({
      id: 1,
      name: '张三',
      age: 18,
    });

    console.log("---数据===",result)
    if (result.success) {
      console.log("---数据===",result.data)
    }
  };

  const ErrorFallback = (props) => (
      <View style={styles.container}>
        <Text style={styles.title}>Something happened!</Text>
        <Text style={styles.text}>{props.error.toString()}</Text>
      </View>
  )

  return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <View style={styles.container}>
          <View className="w-300 h-200 items-center justify-center bg-red-500">
            <Text className="text-xl font-bold text-blue-500">
              Welcome to Nativewind!
            </Text>
          </View>

          <Text style={styles.text}>{count}</Text>
          <Pressable onPress={inc} style={styles.button}>
            <Text>加1</Text>
          </Pressable>
          <Pressable onPress={dec} style={styles.button}>
            <Text>减-</Text>
          </Pressable>
          <Pressable onPress={checkData} style={styles.button}>
            <Text>校验数据</Text>
          </Pressable>
          <Pressable onPress={checkError} style={styles.button}>
            <Text>错误边界</Text>
          </Pressable>
          {
            showErrorBoundary && <ComponentWithError />
          }
        </View>
      </ErrorBoundary>

  )
}
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#fff00f',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: 100,
    height: 50
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  icon: {
    fontSize: 48
  },
});

export default Counter;

