# React Native 性能优化清单

## 启动优化

- [ ] 启用 Hermes 引擎（默认已启用）
- [ ] 启用 inline requires（Metro 配置 `inlineRequires: true`）
- [ ] 减少首屏加载的 JS bundle 大小
- [ ] 使用 RAM bundles（Android 按需加载模块）
- [ ] 延迟加载非首屏依赖
- [ ] 减少同步原生模块调用（阻塞 JS 线程）

## 渲染优化

- [ ] 用 React DevTools Profiler 定位不必要的重渲染
- [ ] 列表用 `FlashList` 替代 `FlatList`
- [ ] `FlashList` 的 `estimatedItemSize` 设置准确值
- [ ] `renderItem` 用 `useCallback` 包裹
- [ ] 避免在渲染中定义匿名函数和内联组件
- [ ] `keyExtractor` 用稳定唯一 key
- [ ] 大列表启用 `getItemType` 区分不同类型的 item
- [ ] 用 `React.memo` 包裹纯展示组件（先 profile 确认是瓶颈）
- [ ] 用 `useMemo` 缓存昂贵的计算结果
- [ ] 用 `useCallback` 缓存传递给子组件的回调

## 动画优化

- [ ] 用 Reanimated v3 而非 RN Animated API
- [ ] 动画在 UI 线程执行（worklet）
- [ ] Worklet 保持轻量，避免大闭包
- [ ] 用 `useAnimatedStyle` 而非 style props
- [ ] 手势用 Gesture Handler v2 的 `Gesture` API
- [ ] 避免 `useAnimatedReaction` 做 `useAnimatedStyle` 能做的事
- [ ] 列表项动画用 Layout Animations

## 图片优化

- [ ] 用 `react-native-fast-image` 做图片缓存
- [ ] 提供明确的 `width` 和 `height`
- [ ] 优先使用 WebP 格式
- [ ] 大图用 `resizeMethod="resize"` 而非默认 scale
- [ ] 列表中的图片用小尺寸缩略图
- [ ] 预加载关键图片

## 内存优化

- [ ] 避免在内存中存储大数据集
- [ ] 大列表用 FlashList（view recycling）
- [ ] 及时清理不再需要的事件监听器和定时器
- [ ] 图片用缓存策略，不要重复加载
- [ ] 用 Flipper 或 Instruments 检查内存泄漏

## 网络优化

- [ ] 用 TanStack Query 做请求缓存
- [ ] 设置合理的 `staleTime` 避免重复请求
- [ ] 用 `React.memo` 减少请求触发的不必要重渲染
- [ ] 大数据集用分页或无限滚动
- [ ] 图片和静态资源用 CDN
- [ ] 实现请求重试和指数退避

## JS 线程优化

- [ ] 避免在 JS 线程做重计算（用 worklet 或原生模块）
- [ ] 大数组操作用 `InteractionManager.runAfterInteractions`
- [ ] 避免频繁的 `setState` 调用（批量更新）
- [ ] 用 `requestAnimationFrame` 同步更新与帧率
- [ ] 避免在滚动/动画期间执行重计算

## 原生端优化

- [ ] 减少 JS-Native 桥调用次数（New Architecture 已大幅改善）
- [ ] 启用 Fabric 渲染器（默认）
- [ ] 用 TurboModules 替代旧 NativeModules
- [ ] 原生模块的重计算放在原生线程

## 工具

- **React DevTools Profiler**：定位重渲染
- **Flipper**：网络、布局、Hermes 性能
- **Systrace / Perfetto**：原生级渲染和布局分析
- **Xcode Instruments**：iOS 内存和 CPU 分析
- **Android Studio Profiler**：Android 内存和 CPU 分析
- **Sentry Performance**：生产环境性能监控

## 基准指标

- 首屏 TTI（Time to Interactive）：< 2 秒
- 列表滚动 FPS：≥ 60
- JS 线程 FPS：≥ 60
- 内存使用：< 200MB（视应用复杂度）
- Bundle 大小：< 10MB（初始 JS bundle）
