import { View, Text, StyleSheet, Pressable } from 'react-native';
import { z } from 'zod';
import { useCounterStore } from './useCounterStore.ts';

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  age: z.number().optional(),
});

function Counter() {
  const { count, inc, dec } = useCounterStore()

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

  return (
    <View style={styles.container}>
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
    </View>
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
  },
});

export default Counter;
function alert(arg0: string) {
    throw new Error('Function not implemented.');
}

