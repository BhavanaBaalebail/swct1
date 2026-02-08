import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Pressable,
    Text,
    TextInput,
    View,
} from 'react-native';
import { loginApi } from '../services/authApi';

const COLORS = {
  purpleMain: '#b37ada',
  purpleLight: '#e2caf2',
  textDark: '#4A235A',
  border: '#C9A6DF',
  white: '#FFFFFF',
};

export default function Login() {
  const router = useRouter();

  const [ntid, setNtid] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!ntid || !password) {
      Alert.alert('Error', 'Please enter NTID and password');
      return;
    }

    setLoading(true);
    const res = await loginApi(ntid, password);
    setLoading(false);

    if (res.success) {
      await AsyncStorage.setItem('ntid', ntid);

      Alert.alert(
        'Login Successful',
        `Welcome ${ntid}`,
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/(tabs)'),
          },
        ],
        { cancelable: false }
      );
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: '85%',
          padding: 26,
          borderRadius: 16,
          backgroundColor: COLORS.white,
          shadowColor: COLORS.purpleMain,
          shadowOpacity: 0.2,
          shadowRadius: 10,
          elevation: 8,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: '600',
            marginBottom: 24,
            textAlign: 'center',
            color: COLORS.purpleMain,
          }}
        >
          Login
        </Text>

      
        <TextInput
          placeholder="NTID"
          placeholderTextColor="#9B7FB6"
          value={ntid}
          onChangeText={setNtid}
          autoCapitalize="none"
          style={{
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 10,
            padding: 14,
            marginBottom: 14,
            color: COLORS.textDark,     
            backgroundColor: COLORS.white,
          }}
        />

       
        <TextInput
          placeholder="Password"
          placeholderTextColor="#9B7FB6"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 10,
            padding: 14,
            marginBottom: 22,
            color: COLORS.textDark,     // ✅ FIX
            backgroundColor: COLORS.white,
          }}
        />

        {/* Login Button */}
        <Pressable
          onPress={onLogin}
          disabled={loading}
          style={{
            backgroundColor: COLORS.purpleMain,
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            opacity: loading ? 0.7 : 1,
          }}
        >
          <Text
            style={{
              color: COLORS.white,
              fontWeight: '600',
              fontSize: 16,
            }}
          >
            {loading ? 'Logging in…' : 'Login'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
