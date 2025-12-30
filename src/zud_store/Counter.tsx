import '../../global.css'
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { z } from 'zod';
import {DeviceInfoModule} from 'react-native-nitro-device-info';
import { useCounterStore } from './useCounterStore.ts';
import ErrorBoundary from "react-native-error-boundary";
import ComponentWithError from "../ComponentWithError.tsx";
import {useEffect, useState} from "react";

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  age: z.number().optional(),
});

function Counter() {
  const { count, inc, dec } = useCounterStore()
  const [showErrorBoundary, setShowErrorBoundary] = useState(false);

  useEffect(() => {
    getDeviceInfo()
  }, []);

  // 获取设备信息
  const getDeviceInfo = async () => {
    console.log("设备类型：",DeviceInfoModule.device); // "iPhone14,2"
    console.log("系统版本：", DeviceInfoModule.systemVersion); // "15.0"
    console.log("设备品牌：",DeviceInfoModule.brand); // "Apple"
    console.log("设备类型：",DeviceInfoModule.model); // "iPhone"

    // Device Capabilities
    const isTablet = DeviceInfoModule.isTablet; // false
    const hasNotch = DeviceInfoModule.getHasNotch(); // true
    const hasDynamicIsland = DeviceInfoModule.getHasDynamicIsland(); // false
    const isCameraPresent = DeviceInfoModule.isCameraPresent; // true
    const isEmulator = DeviceInfoModule.isEmulator; // false
    const deviceYearClass = DeviceInfoModule.deviceYearClass; // 2021 (estimated year class)

// System Resources
    const totalMemory = DeviceInfoModule.totalMemory;
    const usedMemory = DeviceInfoModule.getUsedMemory();
    const totalDisk = DeviceInfoModule.totalDiskCapacity;
    const freeDisk = DeviceInfoModule.getFreeDiskStorage();
    const uptime = DeviceInfoModule.getUptime(); // Uptime in milliseconds

    const uniqueId = DeviceInfoModule.uniqueId;
    console.log(uniqueId); // "FCDBD8EF-62FC-4ECB-B2F5-92C9E79AC7F9"

    const manufacturer = DeviceInfoModule.manufacturer;
    console.log(manufacturer); // "Apple"

    console.log(isTablet); // false

    const batteryLevel = DeviceInfoModule.getBatteryLevel();
    console.log(`Battery: ${(batteryLevel * 100).toFixed(0)}%`); // "Battery: 85%"

    // Asynchronous methods (Promise-based - <100ms)
    const ipAddress = await DeviceInfoModule.getIpAddress();
    console.log(ipAddress); // "192.168.1.100"

    const carrier = await DeviceInfoModule.getCarrier();
    console.log(carrier); // "T-Mobile"

    console.log(
        `RAM: ${(usedMemory / 1024 / 1024).toFixed(0)}MB / ${(totalMemory / 1024 / 1024).toFixed(0)}MB`
    );
    console.log(
        `Storage: ${(freeDisk / 1024 / 1024 / 1024).toFixed(1)}GB free of ${(totalDisk / 1024 / 1024 / 1024).toFixed(1)}GB`
    );
    console.log(
        `Uptime: ${Math.floor(uptime / 1000 / 60 / 60)}h ${Math.floor((uptime / 1000 / 60) % 60)}m`
    );
  }

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

  const ErrorFallback = (props: any) => (
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

