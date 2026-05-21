import { NewAppScreen } from '@react-native/new-app-screen';
import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Platform, Switch, TouchableOpacity
} from 'react-native';
import {
  Icon,
  PaperProvider,
  Snackbar,
  Banner,
  Button,
  Modal,
  Portal,
} from 'react-native-paper';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyList from './src/pages/hot_today';
import NewsDetail from './src/pages/hot_today/news_detail.tsx';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EveryDayNews from './src/pages/every_day_news';
import _updateConfig from "./update.json";
import {UpdateProvider, Pushy, Cresc, useUpdate} from 'react-native-update';
import {LoadingProvider} from "./src/component/loading/LoadingManager";
import {useState} from "react";
// 添加Redux相关导入
import { Provider, useSelector } from 'react-redux';
import { store } from './src/store';
import Counter from './src/zud_store/Counter.tsx';
// 添加TanStack Query相关导入
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/query/queryClient';
import QueryExample from './src/query/queryExample.tsx';
import HotNewsList from "./src/pages/hot_today";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CalendarPage from "./src/pages/tools_box/calendar_page.tsx";
import ToolsHome from "./src/pages/tools_box";
import VideoPage from "./src/pages/tools_box/video_page.tsx";
import ChartsPage from "./src/pages/tools_box/charts_page.tsx";
import ArticlesPage from "./src/pages/articles/index.tsx";
import TutorialPage from "./src/pages/tutorial";
import TutorialDetailPage from "./src/pages/tutorial/detail";
import WebViewPage from "./src/pages/webview/index";
// 导入用户系统相关页面
import LoginPage from "./src/pages/auth/LoginPage";
import RegisterPage from "./src/pages/auth/RegisterPage";
import ProfilePage from "./src/pages/auth/ProfilePage";
import FavoritesPage from "./src/pages/auth/FavoritesPage";
import HistoryPage from "./src/pages/auth/HistoryPage";
import SettingsPage from "./src/pages/settings";
import { RootState } from './src/store';

const { appKey } = _updateConfig[Platform.OS as keyof typeof _updateConfig] || {};
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
      screen: HotNewsList,
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
    Articles: {
      screen: ArticlesPage,
      options: {
        title: '文章',
        tabBarIcon: () => <Text>📚</Text>,
      }
    },
    Tools: {
        screen: ToolsHome,
        options: {
            title: '工具箱',
            tabBarIcon: () => <Text>🔧</Text>,
        }
    },
    Profile: {
        screen: ProfilePage,
        options: {
            title: '我的',
            tabBarIcon: () => <Text>👤</Text>,
        }
    }
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
    Details: NewsDetail,
    CalendarPage: {
        screen: CalendarPage,
        options: {
            title: '日历组件',
        }
    },
    VideoPage: {
        screen: VideoPage,
        options: {
            title: '视频组件',
        }
    },
      ChartsPage: {
      screen: ChartsPage,
      options: {
          title: '图表组件',
      }
  },
    TutorialPage: {
      screen: TutorialPage,
      options: {
          title: '教程页面',
      }
  },
    TutorialDetailPage: {
      screen: TutorialDetailPage,
      options: {
          title: '教程详情',
      }
  },
    WebViewPage: {
      screen: WebViewPage,
      options: {
          title: '网页详情',
          headerShown: false,
      }
  },
    Login: {
      screen: LoginPage,
      options: {
        title: '登录',
        headerShown: true,
      }
    },
    Register: {
      screen: RegisterPage,
      options: {
        title: '注册',
        headerShown: true,
      }
    },
    Favorites: {
      screen: FavoritesPage,
      options: {
        title: '我的收藏',
        headerShown: true,
      }
    },
    History: {
      screen: HistoryPage,
      options: {
        title: '浏览历史',
        headerShown: true,
      }
    },
    Settings: {
      screen: SettingsPage,
      options: {
        title: '设置',
        headerShown: true,
      }
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

function App() {
  const {
    client,
    checkUpdate,
    downloadUpdate,
    switchVersionLater,
    switchVersion,
    updateInfo,
    packageVersion,
    currentHash,
    parseTestQrCode,
    progress: {received, total} = {},
  } = useUpdate();

  const [useDefaultAlert, setUseDefaultAlert] = useState(true);
  const [showTestConsole, setShowTestConsole] = useState(false);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [showUpdateSnackbar, setShowUpdateSnackbar] = useState(false);
  const snackbarVisible =
      !useDefaultAlert && showUpdateSnackbar && updateInfo?.update;


  const isDarkMode = useColorScheme() === 'dark';

  const updateView = () => {
    return (
        <View style={{padding: 20, flex: 1, flexDirection: 'column'}}>
          <View style={{flexDirection: 'row'}}>
            <Text>
              {useDefaultAlert ? '当前使用' : '当前不使用'}默认的alert更新提示
            </Text>
            <Switch
                value={useDefaultAlert}
                onValueChange={v => {
                  setUseDefaultAlert(v);
                  client?.setOptions({
                    updateStrategy: v ? null : 'alwaysAlert',
                  });
                  setShowUpdateSnackbar(!v);
                }}
            />
          </View>

          <Text style={styles.instructions}>
            这是版本一 {'\n'}
            当前原生包版本号: {packageVersion}
            {'\n'}
            当前热更新版本Hash: {currentHash || '(空)'}
            {'\n'}
          </Text>
          <Text>
            下载进度：{received} / {total}
          </Text>

          <TouchableOpacity
              onPress={() => {
                checkUpdate();
                setShowUpdateSnackbar(true);
              }}>
            <Text style={styles.instructions}>点击这里检查更新</Text>
          </TouchableOpacity>

          <TouchableOpacity
              testID="testcase"
              style={{marginTop: 15}}
              onLongPress={() => {
                setShowTestConsole(true);
              }}>
            <Text style={styles.instructions}>
              react-native-update版本：{client?.version}
            </Text>
          </TouchableOpacity>

          {snackbarVisible && (
              <Snackbar
                  visible={snackbarVisible}
                  onDismiss={() => {
                    setShowUpdateSnackbar(false);
                  }}
                  action={{
                    label: '更新',
                    onPress: async () => {
                      setShowUpdateSnackbar(false);
                      await downloadUpdate();
                      setShowUpdateBanner(true);
                    },
                  }}>
                <Text style={{color: 'white'}}>
                  有新版本({updateInfo.name})可用，是否更新？
                </Text>
              </Snackbar>
          )}

          <Banner
              style={{width: '100%', position: 'absolute', top: 0}}
              visible={showUpdateBanner}
              actions={[
                {
                  label: '立即重启',
                  onPress: switchVersion,
                },
                {
                  label: '下次再说',
                  onPress: () => {
                    switchVersionLater();
                    setShowUpdateBanner(false);
                  },
                },
              ]}
              icon={({size}) => (
                  <Text style={{fontSize: size, color: '#00f'}}>✓</Text>
              )}>
            更新已完成，是否立即重启？
          </Banner>
        </View>
    )
  }

  return (
      // 在Redux Provider外层添加QueryClientProvider
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <UpdateProvider client={pushyClient}>
            <SafeAreaProvider>
              {/*<View style={styles.container}>*/}
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                <Navigation/>
                {/*{updateView()}*/}
                <LoadingProvider />
              {/*</View>*/}
            </SafeAreaProvider>

          </UpdateProvider>
        </Provider>
      </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default App;
