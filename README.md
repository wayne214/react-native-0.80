# RNDemo80 - 新闻资讯移动应用

[![React Native](https://img.shields.io/badge/React_Native-0.80.2-2f80ed?style=flat&logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-007acc?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Platform](https://img.shields.io/badge/platform-iOS_|_Android-9cf?style=flat)](https://reactnative.dev/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat)](LICENSE)

一个基于 React Native 的现代化新闻资讯移动应用，提供每日新闻浏览、实时热点资讯和丰富的工具箱功能。

## 🚀 项目简介

RNDemo80 是一款功能丰富的跨平台新闻阅读应用，采用现代化的 React Native 技术栈构建。该应用为用户提供每日新闻摘要、实时热点追踪以及实用工具箱，支持 Android 和 iOS 双平台运行。

> **环境要求**: Node.js >= 18, JDK 17

### ✨ 核心特性

- **📰 每日新闻** - 提供每日60秒读懂世界的图文新闻摘要
- **🔥 实时热点** - 展示最新热点新闻列表，支持下拉刷新
- **📝 详情阅读** - 流畅的新闻详情页面浏览体验
- **📱 跨平台** - 一次编写，多端运行 (Android & iOS)
- **⚡ 性能优化** - 使用 FlashList 实现高性能列表渲染
- **🔄 状态管理** - Redux Toolkit + TanStack Query 数据管理
- **🎨 美观界面** - Material Design 风格 UI 组件
- **🛠️ 工具箱** - 集成日历、视频播放、图表等实用功能

### 🛠️ 技术栈

| 技术/库 | 版本 | 描述 |
|--------|------|------|
| React Native | 0.80.2 | 跨平台移动开发框架 |
| TypeScript | 5.0.4 | 类型安全的 JavaScript 超集 |
| React Navigation | ^7.1.17 | 页面路由与导航管理 |
| Redux Toolkit | latest | 状态管理解决方案 |
| TanStack Query | latest | 服务端状态管理和缓存 |
| Axios | ^1.11.0 | HTTP 请求客户端 |
| FlashList | ^2.0.2 | 高性能列表渲染组件 |
| React Native Paper | ^5.14.5 | Material Design UI 组件库 |
| React Native WebView | ^13.15.0 | 内嵌网页浏览器 |
| React Native Video | ^6.0.0 | 视频播放器组件 |
| React Native Calendars | ^1.1265.0 | 日历组件 |
| React Native Gifted Charts | ^1.4.41 | 图表组件 |
| React Native Update | ^10.30.3 | 应用热更新解决方案 |

## 📁 项目结构

```
src/
├── api/                  # API 接口常量定义
│   └── api_contants.ts
├── component/            # 可复用 UI 组件
│   ├── list/             # 列表及刷新相关组件
│   ├── loading/          # 加载状态组件
│   └── refresh/          # 下拉刷新相关组件
└── pages/                # 页面级组件
    ├── every_day_news/   # 每日新闻模块
    ├── hot_today/        # 今日热点模块
    └── tools_box/        # 工具箱模块
        ├── index.tsx     # 工具箱主页
        ├── calendar_page.tsx  # 日历组件页面
        ├── video_page.tsx     # 视频播放器页面
        └── charts_page.tsx    # 图表组件页面
```

## 🚀 快速开始

### 环境准备

在开始之前，请确保已安装以下依赖：

- [Node.js](https://nodejs.org/) (>= 18.x)
- [JDK](https://openjdk.org/) (17.x)
- 对于 iOS 开发: [Xcode](https://developer.apple.com/xcode/) 和 [CocoaPods](https://cocoapods.org/)
- 对于 Android 开发: [Android Studio](https://developer.android.com/studio) 和 Android SDK

### 本地开发

1. **克隆项目**

```bash
git clone https://github.com/your-username/RNDemo80.git
cd RNDemo80
```

2. **安装依赖**

```bash
# 使用 npm
npm install

# 或使用 Yarn
yarn install
```

3. **iOS 平台配置 (仅限 macOS)**

```bash
# 安装 CocoaPods 依赖
cd ios && pod install && cd ..
```

4. **启动开发服务器**

```bash
# 启动 Metro 服务器
npm start
```

5. **运行应用**

```bash
# 运行 Android 应用
npm run android

# 运行 iOS 应用 (macOS)
npm run ios
```

## 📋 可用脚本

| 脚本 | 描述 |
|------|------|
| `npm start` | 启动 Metro 开发服务器 |
| `npm run android` | 构建并运行 Android 应用 |
| `npm run ios` | 构建并运行 iOS 应用 |
| `npm run lint` | 运行 ESLint 代码检查 |
| `npm test` | 运行单元测试 |
| `npm run build:android` | 构建 Android 发布版 APK |
| `npm run build:ios` | 构建 iOS 发布版 IPA |

## 🎯 核心功能

### 每日新闻
- 自动获取每日图文新闻内容 (`https://api.03c3.cn/api/zb?type=jsonImg`)
- 使用 WebView 组件展示新闻图片
- 集成 TanStack Query 进行数据缓存和管理

### 今日热闻
- 实时热点新闻列表 (`https://api-hot.imsyy.top/toutiao`)
- 支持下拉刷新获取最新数据
- 高性能 FlashList 渲染大量新闻条目
- Redux Toolkit 状态管理

### 工具箱
- **日历组件**: 提供日期选择和日历视图
- **视频播放器**: 支持多种格式的视频播放
- **图表组件**: 多种可视化图表展示数据

## 🧪 开发工具

- **Redux DevTools**: 调试 Redux 状态变化
- **React Native Debugger**: 综合调试工具
- **Flipper**: 移动应用调试平台
- **ESLint + Prettier**: 代码质量和格式化

## 🔐 API 说明

本项目使用以下公开 API:

- 每日新闻: `https://api.03c3.cn/api/zb?type=jsonImg`
- 热点新闻: `https://api-hot.imsyy.top/toutiao`

> **注意**: 由于使用的是第三方免费 API，可能存在不稳定的情况。在生产环境中建议使用自己的后端服务。

## 🏗️ 架构设计

- **分层架构**: 清晰的页面、组件、API 分离
- **类型安全**: 完整的 TypeScript 类型定义
- **状态管理**: Redux Toolkit + TanStack Query 组合方案
- **UI 组件**: React Native Paper Material Design 组件库
- **路由导航**: React Navigation 7 现代化导航方案

## 🧪 测试

```bash
# 运行所有测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 运行特定测试文件
npm run test -- src/__tests__/example.test.ts
```

## 🔧 故障排除

常见问题及解决方案:

- **iOS 编译错误**: 确保运行了 `pod install` 并且 Xcode 版本兼容
- **Android 编译错误**: 检查 Android SDK 版本和环境变量配置
- **Metro 无法启动**: 清除缓存 `npx react-native start --reset-cache`
- **依赖冲突**: 删除 `node_modules` 并重新安装

更多帮助请参考 [React Native 官方文档](https://reactnative.dev/docs/troubleshooting)。

## 🤝 贡献指南

我们欢迎社区贡献！以下是参与项目的方式：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

请确保更新测试用例并遵循代码规范。

## 📄 许可证

本项目采用 [MIT 许可证](./LICENSE)，详情请参阅 [LICENSE 文件](./LICENSE)。

## 🙏 致谢

- [React Native](https://reactnative.dev/) - 跨平台移动开发框架
- [Redux Toolkit](https://redux-toolkit.js.org/) - 状态管理工具
- [TanStack Query](https://tanstack.com/query) - 服务端状态管理
- 所有开源库的维护者和贡献者们
