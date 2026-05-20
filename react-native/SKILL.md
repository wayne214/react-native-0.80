---
name: react-native
description: React Native 开发 Skill。当用户在开发 React Native 应用、创建 RN 项目、编写 RN 组件、调试 RN 性能问题、配置导航、管理状态、编写原生模块、处理平台差异、设置 CI/CD、集成 Expo、迁移新架构、优化列表性能、处理动画、编写测试、集成 Sentry 等任何 React Native 相关开发任务时自动触发。即使用户只说"写个页面"、"优化一下性能"、"加个动画"、"修个 bug"且项目目录下存在 package.json 且依赖了 react-native / expo，也应触发本 Skill。不要 undertrigger——用户在 RN 项目中工作时你不用本 Skill 的最佳实践指导，就可能写出过时或低效的代码。
---

# React Native Development Skill

基于 React Native 官方文档、Meta/Microsoft/ByteDance/Shopify 等大厂最佳实践，为 Claude Code 提供全面的 RN 开发指导。

## 技术栈推荐（2025-2026）

| 类别 | 推荐 | 备选 |
|---|---|---|
| 框架 | **Expo SDK 53+** | Bare RN CLI |
| 架构 | **New Architecture**（Fabric + TurboModules） | 已默认启用 |
| 导航 | **Expo Router v4** | React Navigation v7 |
| 状态管理 | **Zustand** + **TanStack Query** | Jotai, Redux Toolkit |
| 样式 | **NativeWind** 或 **Tamagui** | StyleSheet |
| 列表 | **FlashList** | FlatList（仅小列表） |
| 动画 | **Reanimated v3** + **Gesture Handler v2** | Animated API |
| 表单 | **React Hook Form** + **Zod** | Formik |
| 测试 | **Jest** + **React Native Testing Library** | Vitest |
| E2E | **Detox** 或 **Maestro** | Appium |
| 崩溃上报 | **Sentry** | Bugsnag, Crashlytics |
| CI/CD | **EAS Build** 或 **GitHub Actions + Fastlane** | Bitrise |
| 存储 | **MMKV** + **WatermelonDB** | AsyncStorage |
| HTTP | **TanStack Query** + **Axios** / **ky** | fetch |

## 新项目初始化

优先使用 Expo 管理工作流，它由 Meta 官方推荐且开箱即用：

```bash
# 推荐：Expo 管理工作流
npx create-expo-app@latest my-app --template tabs
cd my-app

# 如果需要 bare RN（一般不需要）
npx @react-native-community/cli init MyApp
```

Expo 默认启用 New Architecture、Hermes 引擎、TypeScript。无需额外配置。

## New Architecture 核心概念

React Native 0.76+ 默认使用 New Architecture，三大核心：

- **JSI**：替代旧 Bridge 的同步 C++ 绑定层，JS 可直接调用原生方法，无 JSON 序列化开销
- **Fabric**：新渲染器，支持 React 18 并发特性（Suspense、useTransition）、同步布局测量
- **TurboModules**：替代旧 NativeModules，懒加载 + Codegen 类型安全

新项目直接用，无需迁移。老项目参考 `references/new-architecture-migration.md`。

## 导航

### Expo Router（推荐）

文件路由，Next.js 风格，零配置深链接：

```
app/
  _layout.tsx          # 根布局（Provider 包裹）
  (tabs)/
    _layout.tsx        # Tab 导航配置
    index.tsx          # 首页 Tab
    profile.tsx        # 个人页 Tab
  (auth)/
    _layout.tsx        # 认证流程布局
    login.tsx
    register.tsx
  [id].tsx             # 动态路由
  +not-found.tsx       # 404 页面
```

关键规则：
- `_layout.tsx` 定义导航器（Stack/Tabs/Drawer）
- `(group)` 圆括号分组不影响 URL
- `error.tsx` 和 `loading.tsx` 作为约定的错误/加载边界
- 类型化路由默认启用

### React Navigation v7（bare RN 项目）

```typescript
// 类型安全的路由定义
type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Settings: { section?: string };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

// 使用 hook 而非 prop drilling
const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
```

## 状态管理

### 客户端状态：Zustand

```typescript
// 按 feature 拆分 store，用 selector 减少重渲染
interface AuthState {
  user: User | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: async (credentials) => {
    const user = await authService.login(credentials);
    set({ user });
  },
  logout: () => set({ user: null }),
}));

// 组件中使用 selector
const userName = useAuthStore((s) => s.user?.name);
```

中间件：`persist`（AsyncStorage/MMKV 持久化）、`devtools`、`immer`。

### 服务端状态：TanStack Query

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['posts', userId],
  queryFn: () => fetchPosts(userId),
  staleTime: 5 * 60 * 1000, // 5 分钟
});
```

TanStack Query 处理 API 数据缓存、后台刷新、乐观更新。与 Zustand 互补而非替代。

## 性能优化

### 列表：FlashList 替代 FlatList

```typescript
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={items}
  renderItem={({ item }) => <ItemRow item={item} />}
  estimatedItemSize={80}  // 关键：准确估算每项高度
  keyExtractor={(item) => item.id}
/>
```

`estimatedItemSize` 设得越准，滚动越流畅。用 `overrideItemLayout` 处理已知固定尺寸的项。

### 动画：Reanimated v3

```typescript
const offset = useSharedValue(0);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: offset.value }],
}));

// 动画在 UI 线程执行，不影响 JS 线程
offset.value = withSpring(100);
```

规则：
- Worklet 保持轻量，避免大闭包和重计算
- 用 `useAnimatedStyle` 而非直接传 style props
- 手势动画用 `Gesture` API（react-native-gesture-handler v2+）

### 通用优化

- **Hermes**：默认引擎，构建时预编译字节码，启动更快、内存更低
- **inline requires**：Metro 配置启用，懒加载模块，加速启动
- **图片**：用 `react-native-fast-image` 做缓存，提供宽高，优先 WebP 格式
- **避免重渲染**：先用 React DevTools Profiler 定位，再有针对性地用 `React.memo` / `useMemo` / `useCallback`
- **不要**盲目到处加 memo——先 profile，再优化

## TypeScript 配置

```json
{
  "compilerOptions": {
    "strict": true,
    "jsx": "react-native",
    "moduleResolution": "node",
    "target": "esnext",
    "module": "commonjs",
    "paths": {
      "@components/*": ["./src/components/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@store/*": ["./src/store/*"]
    }
  }
}
```

规则：
- `strict: true` 不妥协，新项目必须开启
- 用 `interface` 定义组件 props 和对象形状，`type` 用于联合/交叉/计算类型
- 不要用 `React.FC`——React 18 已移除隐式 children
- API 响应用 **Zod** 做运行时校验，不信任外部数据

## 平台差异处理

```typescript
// 小差异：Platform.select
const styles = StyleSheet.create({
  shadow: Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1 },
    android: { elevation: 4 },
  }),
});

// 大差异：平台文件扩展名（Metro 自动解析）
// Component.tsx       ← 共享/回退
// Component.ios.tsx   ← iOS 专用
// Component.android.tsx ← Android 专用
```

小差异用 `Platform.select`，大差异用平台文件扩展名。避免在共享文件里写大段 `if/else`。

## 错误处理

```typescript
// 错误边界：包裹根页面和关键 feature
class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError() { return { hasError: true }; }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    Sentry.captureException(error, { extra: info });
  }

  render() {
    return this.state.hasError ? <FallbackScreen /> : this.props.children;
  }
}

// 全局未捕获错误
ErrorUtils.setGlobalHandler((error, isFatal) => {
  Sentry.captureException(error, { extra: { isFatal } });
});
```

**Sentry 集成**：
- CI 构建时上传 source map（Sentry CLI 或 EAS Build hook）
- 设置 `release` 和 `environment` 标签
- Sentry 提供 JS + 原生崩溃捕获、面包屑、性能监控、Session Replay

## 测试策略

### 单元/集成测试：Jest + React Native Testing Library

```typescript
import { render, screen, userEvent } from '@testing-library/react-native';

test('login form submits credentials', async () => {
  const user = userEvent.setup();
  render(<LoginScreen />);
  await user.type(screen.getByLabelText('Email'), 'test@example.com');
  await user.type(screen.getByLabelText('Password'), 'password123');
  await user.press(screen.getByRole('button', { name: 'Sign In' }));
  expect(mockLogin).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
});
```

规则：
- 用户视角测试：`getByRole`、`getByText`、`getByLabelText` 优于 `getByTestId`
- 测试文件就近放置：`Component.test.tsx` 与 `Component.tsx` 同目录
- 用 `userEvent` 做交互，不用 `fireEvent`
- Mock 原生模块：AsyncStorage、Reanimated、导航、原生桥

### E2E 测试：Detox 或 Maestro

- **Detox**：灰色测试，深度 RN 集成，`by.id()` 选择器比 `by.text()` 稳定
- **Maestro**：YAML 定义测试，更简单，Maestro Cloud 免管理模拟器

## 项目结构

### 小中型项目（按类型分）

```
src/
  assets/           # 图片、字体、声音
  components/       # 可复用 UI 组件
  constants/        # 全局常量
  hooks/            # 自定义 hooks
  navigation/       # 导航配置
  screens/          # 页面级组件
  services/         # API 客户端
  store/            # 状态管理
  types/            # 共享类型
  utils/            # 工具函数
```

### 大型项目（按 feature 分，推荐）

```
src/
  features/
    auth/           # 认证 feature（组件/hooks/页面/store/测试）
    feed/           # 信息流 feature
    profile/        # 个人页 feature
  shared/           # 跨 feature 共享代码
  app/              # 入口、根导航、Provider
```

核心原则：
- Feature 共置：相关文件放一起
- Barrel exports：`index.ts` 统一导出
- 绝对导入：`tsconfig.json` 配 `paths` 避免深层相对路径
- 环境变量：用 `react-native-config` 或 Expo `.env`，不硬编码密钥

## CI/CD

### Expo 项目：EAS Build

```bash
eas build --platform all    # 并行构建 iOS + Android
eas submit                  # 提交到 App Store / Play Store
eas update                  # OTA JS 更新（跳过审核）
```

### Bare RN 项目：GitHub Actions + Fastlane

CI 流程：lint → test → build（并行 iOS/Android） → deploy

关键实践：
- 缓存 `node_modules`、Gradle、CocoaPods、Metro
- 并行 job：lint、test、build 同时跑
- 先测试：lint 或 test 失败则不构建
- 每次生产构建上传 source map 到 Sentry
- 用 GitHub Secrets 管理签名密钥和 API token

## 反模式（不要做）

- 不要盲目到处加 `React.memo` / `useMemo`——先用 Profiler 确认是瓶颈再优化
- 不要用 `FlatList` 处理大列表——换 `FlashList`
- 不要在渲染中定义匿名函数和内联组件（破坏 memo 和 key 稳定性）
- 不要忽略 `estimatedItemSize`——FlashList 性能严重依赖它
- 不要在 worklet（Reanimated）里做重计算或大闭包
- 不要用 `React.FC`——已过时
- 不要跳过 TypeScript strict 模式
- 不要硬编码 API key 或密钥
- 不要用 snapshot 测试——维护成本高、易碎，用行为测试
- 不要在共享文件里写大段 `Platform.OS` if/else——用平台文件扩展名

## 详细参考

更深入的内容见 `references/` 目录：
- `new-architecture-migration.md` — 老项目迁移到新架构的步骤
- `recommended-libraries.md` — 推荐库的详细说明和使用场景
- `performance-checklist.md` — 性能优化完整清单
