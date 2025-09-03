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
} from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyList from './src/pages/hot_today';
import NewsDetail from './src/pages/hot_today/news_detail.tsx';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EveryDayNews from './src/pages/every_day_news';

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
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Navigation/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
