// src/pages/auth/RegisterPage.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { registerStart, registerSuccess, registerFailure, clearError } from '../../store/userSlice';
import { RootState } from '../../store';
import { authApi } from '../../api/authApi';

const RegisterPage = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.user);

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('错误', '请填写所有字段');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('错误', '两次输入的密码不一致');
      return;
    }

    if (password.length < 6) {
      Alert.alert('错误', '密码长度至少为6位');
      return;
    }

    dispatch(registerStart());
    dispatch(clearError());

    try {
      const response = await authApi.register({ username, email, password });
      dispatch(registerSuccess(response));
      Alert.alert('注册成功', '账户创建成功！', [
        { text: '确定', onPress: () => navigation.replace('Home') }
      ]);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || '注册失败';
      dispatch(registerFailure(errorMessage));
      Alert.alert('注册失败', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>注册</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="用户名"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="邮箱"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, styles.passwordInput]}
          placeholder="密码"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.passwordToggle}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Text>{showPassword ? '隐藏' : '显示'}</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="确认密码"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={!showPassword}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>注册</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text>已有账号？</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>登录</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
  },
  passwordToggle: {
    position: 'absolute',
    right: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  link: {
    color: '#007AFF',
    marginLeft: 5,
  },
  error: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default RegisterPage;