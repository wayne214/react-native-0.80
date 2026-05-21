import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';

const SettingsPage = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  const handleClearCache = () => {
    Alert.alert(
      '清除缓存',
      '确定要清除所有缓存数据吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: () => {
            Alert.alert('成功', '缓存已清除');
          },
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      '关于',
      'RNDemo80 v1.0.0\n\n一个基于 React Native 的新闻资讯应用',
      [{ text: '确定' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* 通知设置 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>通知</Text>
        <View style={styles.option}>
          <Text style={styles.optionText}>推送通知</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#ccc', true: '#81b0ff' }}
            thumbColor={notificationsEnabled ? '#007AFF' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* 显示设置 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>显示</Text>
        <View style={styles.option}>
          <Text style={styles.optionText}>深色模式</Text>
          <Switch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
            trackColor={{ false: '#ccc', true: '#81b0ff' }}
            thumbColor={darkModeEnabled ? '#007AFF' : '#f4f3f4'}
          />
        </View>

        <View style={styles.option}>
          <Text style={styles.optionText}>字体大小</Text>
          <View style={styles.fontSizeContainer}>
            {(['small', 'medium', 'large'] as const).map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.fontSizeButton,
                  fontSize === size && styles.fontSizeButtonActive,
                ]}
                onPress={() => setFontSize(size)}
              >
                <Text
                  style={[
                    styles.fontSizeText,
                    fontSize === size && styles.fontSizeTextActive,
                  ]}
                >
                  {size === 'small' ? '小' : size === 'medium' ? '中' : '大'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* 数据设置 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>数据</Text>
        <View style={styles.option}>
          <Text style={styles.optionText}>自动刷新</Text>
          <Switch
            value={autoRefreshEnabled}
            onValueChange={setAutoRefreshEnabled}
            trackColor={{ false: '#ccc', true: '#81b0ff' }}
            thumbColor={autoRefreshEnabled ? '#007AFF' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity style={styles.option} onPress={handleClearCache}>
          <Text style={styles.optionText}>清除缓存</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* 关于 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>其他</Text>
        <TouchableOpacity style={styles.option} onPress={handleAbout}>
          <Text style={styles.optionText}>关于</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 10,
    marginHorizontal: 16,
    borderRadius: 10,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 13,
    color: '#666',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    textTransform: 'uppercase',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  arrow: {
    fontSize: 18,
    color: '#ccc',
  },
  fontSizeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  fontSizeButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  fontSizeButtonActive: {
    backgroundColor: '#007AFF',
  },
  fontSizeText: {
    fontSize: 14,
    color: '#666',
  },
  fontSizeTextActive: {
    color: '#fff',
  },
});

export default SettingsPage;
