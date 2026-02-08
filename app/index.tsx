import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const [status, setStatus] = useState<'loading' | 'login' | 'tabs'>('loading');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const ntid = await AsyncStorage.getItem('ntid');
        setStatus(ntid ? 'tabs' : 'login');
      } catch (e) {
        setStatus('login');
      }
    };

    checkAuth();
  }, []);

  if (status === 'loading') {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F6F1EB',
        }}
      >
        <ActivityIndicator size="large" color="#b37ada" />
      </View>
    );
  }

  return status === 'tabs' ? (
    <Redirect href="/(tabs)" />
  ) : (
    <Redirect href="/login" />
  );
}
