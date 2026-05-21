# 原生模块开发指南

React Native 0.76+ 使用 TurboModules 替代旧 NativeModules，支持 Codegen 类型安全。

## TurboModules（推荐）

### 1. 定义 TypeScript 规范

```typescript
// src/specs/NativeCalculator.ts
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  add(a: number, b: number): Promise<number>;
  multiply(a: number, b: number): number; // 同步方法
  getConstants(): {
    PI: number;
    E: number;
  };
}

export default TurboModuleRegistry.getEnforcing<Spec>('Calculator');
```

### 2. iOS 实现（Swift）

```swift
// ios/Calculator.swift
import Foundation
import React

@objc(Calculator)
class Calculator: NSObject {

  @objc
  func add(_ a: Double, b: Double, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    resolve(a + b)
  }

  @objc
  func multiply(_ a: Double, b: Double) -> Double {
    return a * b
  }

  @objc
  func getConstants() -> NSDictionary {
    return ["PI": Double.pi, "E": M_E]
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
```

```objc
// ios/Calculator.m (桥接文件)
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(Calculator, NSObject)
RCT_EXTERN_METHOD(add:(double)a b:(double)b resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(multiply:(double)a b:(double)b)
@end
```

### 3. Android 实现（Kotlin）

```kotlin
// android/app/src/main/java/com/rndemo80/CalculatorModule.kt
package com.rndemo80

import com.facebook.react.bridge.*
import kotlin.math.PI
import kotlin.math.E

class CalculatorModule(reactContext: ReactApplicationContext) : NativeCalculatorSpec(reactContext) {

  override fun getName() = NAME

  override fun add(a: Double, b: Double, promise: Promise) {
    promise.resolve(a + b)
  }

  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }

  override fun getConstants(): HashMap<String, Any> {
    return hashMapOf("PI" to PI, "E" to E)
  }

  companion object {
    const val NAME = "Calculator"
  }
}
```

```kotlin
// android/app/src/main/java/com/rndemo80/CalculatorPackage.kt
package com.rndemo80

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.*
import com.facebook.react.module.model.*

class CalculatorPackage : TurboReactPackage() {
  override fun getModule(name: String, context: ReactApplicationContext): NativeModule? {
    return if (name == CalculatorModule.NAME) {
      CalculatorModule(context)
    } else {
      null
    }
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
    return ReactModuleInfoProvider {
      mapOf(
        CalculatorModule.NAME to ReactModuleInfo(
          CalculatorModule.NAME,
          CalculatorModule.NAME,
          false, // canOverrideExistingModule
          false, // needsEagerInit
          true,  // hasConstants
          false, // isCxxModule
          true   // isTurboModule
        )
      )
    }
  }
}
```

### 4. Codegen 配置

在 `package.json` 中添加：

```json
{
  "codegenConfig": {
    "name": "RNDemo80Specs",
    "type": "modules",
    "jsSrcsDir": "src/specs",
    "android": {
      "javaPackageName": "com.rndemo80"
    }
  }
}
```

运行 Codegen：

```bash
# iOS
cd ios && pod install

# Android
cd android && ./gradlew generateCodegenArtifactsFromSchema
```

## 旧版 NativeModules（兼容）

如需支持旧架构或第三方库兼容：

```typescript
// 使用 NativeModules 桥接
import { NativeModules, Platform } from 'react-native';

const { Calculator } = NativeModules;

// 调用
const result = await Calculator.add(1, 2);
```

## 原生模块最佳实践

- **线程安全**：原生方法默认在后台线程执行，UI 操作需切到主线程
- **错误处理**：使用 `Promise.reject` 返回错误，不要抛异常
- **类型一致**：确保 iOS/Android 返回值类型一致
- **内存管理**：避免在原生模块中持有 React Context 强引用
- **性能**：频繁调用的方法用同步版本，避免 Promise 开销
- **文档**：为每个原生方法添加 JSDoc 注释，说明参数和返回值

## 常见原生模块场景

| 场景 | 推荐方案 |
|---|---|
| 设备信息 | `react-native-device-info` |
| 文件系统 | `react-native-fs` 或 `expo-file-system` |
| 本地通知 | `react-native-push-notification` |
| 生物识别 | `react-native-biometrics` |
| 蓝牙 | `react-native-ble-plx` |
| 相机 | `react-native-vision-camera` |
| 地图 | `react-native-maps` |

优先使用社区维护的成熟库，仅在无现成方案时自行开发原生模块。
