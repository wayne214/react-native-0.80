# 推荐库详细说明

## 状态管理

### Zustand (~1.1KB)
- 最小样板代码，无需 Provider 包裹
- `create()` 创建 store，组件通过 selector 订阅
- 中间件：`persist`（MMKV/AsyncStorage 持久化）、`devtools`、`immer`
- 适合：大多数项目

### Jotai (~2KB)
- 原子化状态，每个状态独立 atom
- 组件只在自己的 atom 变化时重渲染
- `atomWithStorage` 持久化，`atomFamily` 参数化
- 适合：状态项多且独立的场景

### Redux Toolkit
- 最佳 DevTools 体验，中间件生态丰富
- RTK Query 自动缓存、轮询、失效
- `createSlice` + `configureStore` 减少样板
- 适合：大型企业应用、团队已有 Redux 经验

### TanStack Query (React Query)
- 处理服务端状态（API 数据缓存、后台刷新、乐观更新）
- 与 Zustand/Jotai/Redux 互补，不替代
- `useQuery`、`useMutation`、`useInfiniteQuery`
- 适合：所有需要 API 调用的项目

## 导航

### Expo Router v4
- 文件路由（Next.js 风格），`app/` 目录
- `_layout.tsx` 定义导航器，`(group)` 分组，`[id]` 动态路由
- 零配置深链接，类型化路由默认
- 适合：新 Expo 项目

### React Navigation v7
- 静态 API `createStaticNavigation` 提升类型推断
- `useNavigation` hook，`Group` 组件分组
- `linking` 配置深链接
- 适合：bare RN 项目

## UI 与样式

### NativeWind
- Tailwind CSS for React Native
- 原子化样式类，跨平台一致
- 支持暗色模式、响应式断点
- 适合：习惯 Tailwind 的团队

### Tamagui
- 编译时优化的跨平台 UI 框架
- 组件 + 样式 + 动画一体化
- 支持 Web + Native 同构
- 适合：需要 Web + Native 共享代码的项目

### react-native-fast-image
- 图片缓存（基于 SDWebImage/Glide）
- 优先级控制、预加载
- 比 RN 内置 Image 性能好很多
- 适合：所有需要图片展示的项目

## 动画与手势

### Reanimated v3
- UI 线程执行动画，60fps+
- `useSharedValue`、`useAnimatedStyle`、`withTiming`、`withSpring`
- Layout animations 支持列表项 enter/exit/layout
- 适合：所有需要动画的项目

### react-native-gesture-handler v2
- 声明式手势 API（`Gesture.Pan()`、`Gesture.Tap()`）
- 与 Reanimated 深度集成
- 原生手势识别器，比 RN 内置 PanResponder 更流畅
- 适合：需要手势交互的项目

### Lottie React Native
- After Effects 动画导出为 JSON
- 复杂动画无需手写代码
- 适合：加载动画、微交互、品牌动画

## 表单

### React Hook Form
- 最小重渲染，性能优秀
- 与 Zod 集成做 schema 验证
- `useForm` hook，`Controller` 包裹自定义组件
- 适合：所有表单场景

### Zod
- TypeScript 优先的 schema 验证
- 运行时验证 API 响应、表单数据、deep link 参数
- `z.infer` 自动推导 TypeScript 类型
- 适合：所有需要数据验证的场景

## 存储

### react-native-mmkv (MMKV)
- 比 AsyncStorage 快 30 倍
- 同步读写，支持加密
- Zustand persist 中间件直接支持
- 适合：key-value 存储（用户设置、token、缓存）

### WatermelonDB
- 基于 SQLite 的高性能本地数据库
- 懒加载，百万级数据量无压力
- 支持同步协议（与后端同步）
- 适合：需要复杂本地数据存储的应用

## 调试

### Flipper
- Meta 出品的调试平台
- 网络请求、布局检查、Hermes 性能分析、数据库浏览
- 插件生态丰富
- 适合：开发阶段调试

### Reactotron
- 轻量级调试工具
- API 请求追踪、状态快照、AsyncStorage 检查
- 适合：不习惯 Flipper 的开发者

## 国际化

### i18next + react-i18next
- 成熟的 i18n 框架
- 命名空间、复数、插值、上下文
- 适合：需要多语言支持的应用

### expo-localization
- Expo 内置的本地化工具
- 获取设备语言、地区、时区
- 适合：Expo 项目

## 网络

### Axios
- 请求/响应拦截器
- 自动 JSON 转换
- 请求取消
- 适合：需要复杂 HTTP 配置的项目

### ky
- 基于 fetch 的轻量 HTTP 客户端
- 简洁 API，TypeScript 优先
- 适合：偏好原生 fetch 的团队
