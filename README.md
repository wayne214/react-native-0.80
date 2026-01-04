# RNDemo80

一个基于 React Native 的新闻资讯移动应用，提供每日新闻浏览和实时热点资讯功能。

## 📱 项目简介

RNDemo80 是一个功能完整的新闻类移动应用，采用现代化的 React Native 技术栈开发，支持跨平台运行于 Android 和 iOS 设备。
特别说明，node >= 18, jdk 17

### 🎯 主要功能

- **📰 每日60秒读懂世界**：通过 WebView 展示每日图文新闻
- **🔥 今日热闻列表**：展示实时热点新闻条目，支持列表浏览
- **📝 新闻详情页**：点击新闻条目跳转至详情页面查看完整内容
- **🔄 下拉刷新**：支持用户手动下拉刷新获取最新内容
- **⚡ 加载状态管理**：集成统一的全局加载提示组件
- **🚀 热更新支持**：通过 react-native-update 实现应用热修复与版本更新

### 🛠️ 技术栈

| 技术/库 | 版本 | 用途 |
|--------|------|------|
| React Native | 0.80.2 | 跨平台移动开发框架 |
| TypeScript | 5.0.4 | 类型安全的 JavaScript 超集 |
| React Navigation 7 | ^7.1.17 | 页面路由与导航管理 |
| Axios | ^1.11.0 | HTTP 请求客户端 |
| React Native WebView | ^13.15.0 | 内嵌网页浏览器 |
| FlashList | ^2.0.2 | 高性能列表渲染组件 |
| React Native Paper | ^5.14.5 | Material Design UI 组件库 |
| react-native-update | ^10.30.3 | 热更新解决方案 |
| @reduxjs/toolkit | latest | Redux 状态管理 |
| react-redux | latest | Redux React 绑定 |
| @tanstack/react-query | latest | 数据获取和缓存管理 |

### 📁 项目结构

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
    └── hot_today/        # 今日热点模块
```

## 🚀 快速开始

> **注意**: 请确保您已经完成了 [React Native 开发环境搭建](https://reactnative.dev/docs/set-up-your-environment)。

### 1. 安装依赖

```bash
# 使用 npm
npm install

# 或使用 Yarn
yarn install
```

### 2. 启动 Metro 服务器

首先需要启动 Metro（React Native 的 JavaScript 构建工具）：

```bash
# 使用 npm
npm start

# 或使用 Yarn
yarn start
```

### 3. 运行应用

在 Metro 服务器运行的情况下，打开新的终端窗口，使用以下命令构建并运行应用：

#### Android

```bash
# 使用 npm
npm run android

# 或使用 Yarn
yarn android
```

#### iOS

对于 iOS，需要先安装 CocoaPods 依赖（仅在首次克隆或更新原生依赖后需要运行）：

```bash
# 首次创建项目时，运行 Ruby bundler 安装 CocoaPods
bundle install

# 然后，每次更新原生依赖时都需要运行
bundle exec pod install
```

更多信息请参考 [CocoaPods 入门指南](https://guides.cocoapods.org/using/getting-started.html)。

```bash
# 使用 npm
npm run ios

# 或使用 Yarn
yarn ios
```

如果一切设置正确，您应该能看到应用在 Android 模拟器、iOS 模拟器或您的真机设备上运行。

您也可以直接从 Android Studio 或 Xcode 构建和运行应用。

### 4. 开发调试

现在您已经成功运行了应用，可以开始开发了！

打开 `App.tsx` 或 `src/` 目录下的任何文件进行修改。保存后，应用会自动更新并反映这些更改——这是由 [Fast Refresh](https://reactnative.dev/docs/fast-refresh) 功能提供的。

当您需要强制重新加载（例如重置应用状态）时，可以执行完全重载：

- **Android**: 按两次 <kbd>R</kbd> 键或从开发菜单中选择 **"Reload"**（通过 <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) 或 <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS) 访问开发菜单）
- **iOS**: 在 iOS 模拟器中按 <kbd>R</kbd> 键

## 📋 可用脚本

```bash
npm start          # 启动 Metro 开发服务器
npm run android    # 运行 Android 应用
npm run ios        # 运行 iOS 应用
npm run lint       # 运行 ESLint 代码检查
npm test           # 运行测试
```

## 🧪 状态管理开发脚本

项目集成了 Redux 和 TanStack Query 进行状态管理，开发时可以使用以下工具：

- Redux DevTools: 在开发模式下可以安装浏览器扩展来调试 Redux 状态变化
- React Query DevTools: 可以可视化查看缓存状态和网络请求

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## 🎯 核心功能介绍

### 每日新闻页面
- 自动获取每日图文新闻内容
- 使用 WebView 组件展示新闻图片
- 使用 TanStack Query 进行数据获取和缓存管理
- 数据来源：`https://api.03c3.cn/api/zb?type=jsonImg`

### 今日热闻页面
- 展示实时热点新闻列表
- 支持下拉刷新获取最新数据
- 点击新闻条目跳转到详情页面
- 使用高性能的 FlashList 组件渲染列表
- 使用 Redux Toolkit 管理新闻列表状态
- 数据来源：`https://api-hot.imsyy.top/toutiao`

### 新闻详情页
- 通过 WebView 加载外部新闻页面
- 动态设置导航栏标题
- 支持网页内容的完整展示

## 🏗️ 架构特点

- **分层架构**：页面层、组件层、API 层清晰分离
- **组件复用**：可复用的刷新组件和加载组件
- **类型安全**：全面使用 TypeScript 确保代码质量
- **现代导航**：使用 React Navigation 7 实现流畅的页面切换
- **状态管理**：集成 Redux Toolkit 进行全局状态管理
- **数据获取**：使用 TanStack Query 进行数据获取和缓存管理

## 📊 状态管理

### Redux Toolkit

项目集成了 Redux Toolkit 进行全局状态管理，主要包括：

- **News Slice**: 管理新闻列表、分页信息和错误状态
- **Loading Slice**: 管理全局加载状态
- **Store 配置**: 配置了合理的中间件和类型定义

### TanStack Query

使用 TanStack Query (以前称为 React Query) 进行服务器状态管理，提供：

- **自动缓存**: 智能缓存机制，减少不必要的网络请求
- **后台更新**: 在后台自动更新数据
- **错误重试**: 自动重试失败的请求
- **加载状态**: 自动管理加载和错误状态

## 🔧 故障排除

如果在运行上述步骤时遇到问题，请参考 [React Native 故障排除页面](https://reactnative.dev/docs/troubleshooting)。

## 📚 学习资源

- [React Native 官网](https://reactnative.dev) - 了解更多 React Native 相关内容
- [环境搭建指南](https://reactnative.dev/docs/environment-setup) - React Native 环境搭建概览
- [基础教程](https://reactnative.dev/docs/getting-started) - React Native 基础知识导览
- [官方博客](https://reactnative.dev/blog) - 阅读最新的 React Native 官方博客文章
- [GitHub 仓库](https://github.com/facebook/react-native) - React Native 开源项目

## 🤝 贡献

欢迎提交 Issues 和 Pull Requests 来改进项目！

## 📄 许可证

本项目采用 MIT 许可证。
