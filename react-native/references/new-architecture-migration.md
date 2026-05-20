# New Architecture 迁移指南

## 概述

React Native 0.76+ 默认启用 New Architecture（Fabric + TurboModules + JSI）。新项目直接使用，无需迁移。本文档针对已有老项目。

## 迁移步骤

### 1. 升级 React Native 版本

先升级到 0.76+，确保所有依赖兼容。使用 [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) 对比 diff。

### 2. 启用 New Architecture

```json
// react-native.config.js 或 android/gradle.properties
newArchEnabled=true
```

iOS 在 `Podfile` 中：
```ruby
ENV['RCT_NEW_ARCH_ENABLED'] = '1'
```

### 3. 逐步迁移原生模块

**旧方式（NativeModules）**：
```java
// Android: 继承 ReactContextBaseJavaModule
public class MyModule extends ReactContextBaseJavaModule {
  @ReactMethod
  public void doSomething(String param, Promise promise) { ... }
}
```

**新方式（TurboModules + Codegen）**：
```typescript
// TypeScript spec 文件
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  doSomething(param: string): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('MyModule');
```

Codegen 自动生成 C++/Java/ObjC 绑定代码。

### 4. Interop Layer

社区库未迁移时，New Architecture 提供 interop layer 兼容旧模块。无需等所有依赖都迁移完。

已迁移的关键库：
- react-native-reanimated
- react-navigation / react-native-screens
- react-native-gesture-handler
- @shopify/flash-list
- react-native-svg

### 5. Bridgeless 模式

完全移除旧 Bridge，只用 JSI：
```json
// android/gradle.properties
bridgelessEnabled=true
```

### 6. 验证

- 运行所有 E2E 测试
- 检查原生模块调用是否正常
- 监控启动时间和内存使用
- 用 Flipper 或 Chrome DevTools 检查 JS 性能

## 常见问题

- **Q: 我的第三方库还没迁移怎么办？**
  A: Interop layer 会自动处理，大部分旧模块无需修改即可工作。

- **Q: 迁移后性能会变差吗？**
  A: 不会。新架构本身就是性能优化，JSI 消除了 Bridge 序列化开销。

- **Q: 需要同时迁移 iOS 和 Android 吗？**
  A: 不需要，可以逐平台迁移。
