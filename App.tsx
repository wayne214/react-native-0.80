/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Platform
} from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyList from './src/pages/hot_today';
import NewsDetail from './src/pages/hot_today/news_detail.tsx';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EveryDayNews from './src/pages/every_day_news';
import _updateConfig from "./update.json";
import { UpdateProvider, Pushy } from "react-native-update";
import {LoadingProvider} from "./src/component/loading/LoadingManager";

const { appKey } = _updateConfig[Platform.OS];
// 唯一必填参数是appKey，其他选项请参阅 api 文档
const pushyClient = new Pushy({
  appKey,
  // 注意，默认情况下，在开发环境中不会检查更新
  // 如需在开发环境中调试更新，请设置debug为true
  // 但即便打开此选项，也仅能检查、下载热更，并不能实际应用热更。实际应用热更必须在release包中进行。
  // debug: true
});

const HomeTabs = createBottomTabNavigator({
  screens: {
    MyList: {
      screen: MyList,
      options: {
        title: '今日热闻',
        tabBarIcon: () => <Text>🔥</Text>,
      }
    },
    EveryNews: {
      screen: EveryDayNews,
      options: {
        title: '每日60S读懂世界',
        tabBarIcon: () => <Text>📰</Text>,
      }
    },
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeTabs,
      options: {
        headerShown: false,
      }
    },
    Details: NewsDetail
  },
});

const Navigation = createStaticNavigation(RootStack);

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
      <UpdateProvider client={pushyClient}>
        <View style={styles.container}>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <Navigation/>
          <LoadingProvider />
        </View>
      </UpdateProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
