import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  Linking,
  Pressable,
  Text,
  View,
} from 'react-native';

import {
  getNotifications,
  Notification,
  removeNotification,
} from '../../services/notificationApi';

const COLORS = {
  background: '#F6F1EB',
  purpleLight: '#e2caf2',
  purpleMain: '#b37ada',
  white: '#FFFFFF',
};

export default function ReminderInbox() {
  const router = useRouter();

  const [ntid, setNtid] = useState<string | null>(null);
  const userLetter = ntid ? ntid.charAt(0).toUpperCase() : '';

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  // 🔐 Load NTID & protect route
  useEffect(() => {
    const loadAuth = async () => {
      const storedNtid = await AsyncStorage.getItem('ntid');

      if (!storedNtid) {
        router.replace('/login');
        return;
      }

      setNtid(storedNtid);
    };

    loadAuth();
  }, []);

  // 🔁 Load notifications
  useEffect(() => {
    const loadData = async () => {
      const apiData = await getNotifications();
      setNotifications(apiData);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 14,
          stiffness: 120,
          useNativeDriver: true,
        }),
      ]).start();
    };

    loadData();
  }, []);

  const dismiss = async (id: string) => {
    await removeNotification(id);
    const updated = await getNotifications();
    setNotifications(updated);
  };

  const logout = () => {
    Alert.alert(
      'Logout',
      'Do you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('ntid');
            router.replace('/login');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        marginBottom: 20,
      }}
    >
      <LinearGradient
        colors={[COLORS.purpleLight, COLORS.purpleMain]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          padding: 20,
          borderRadius: 16,
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <Text style={{ fontSize: 12, letterSpacing: 1, color: '#E8DDF8' }}>
          REMINDER
        </Text>

        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: COLORS.white,
            marginBottom: 6,
          }}
        >
          {item.title}
        </Text>

        <Text style={{ color: '#EFE9F7', marginBottom: 18 }}>
          {item.description}
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Pressable
            onPress={() => Linking.openURL('https://www.google.com')}
            style={{
              backgroundColor: COLORS.white,
              paddingVertical: 10,
              paddingHorizontal: 26,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#4A235A', fontWeight: '500' }}>
              Yes
            </Text>
          </Pressable>

          <Pressable
            onPress={() => dismiss(item.id)}
            style={{
              backgroundColor: 'rgba(255,255,255,0.25)',
              paddingVertical: 10,
              paddingHorizontal: 26,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: COLORS.white }}>
              Cancel
            </Text>
          </Pressable>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  // ⏳ While checking auth
  if (!ntid) {
    return <View style={{ flex: 1, backgroundColor: COLORS.background }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <LinearGradient
        colors={[COLORS.purpleLight, COLORS.purpleMain]}
        style={{
          paddingTop: 52,
          paddingBottom: 18,
          paddingHorizontal: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: '600',
            color: COLORS.white,
          }}
        >
          Levelled Checklist Reminder
        </Text>

        {/* Avatar → Logout */}
        <Pressable onPress={logout}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: 'rgba(255,255,255,0.3)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                color: COLORS.white,
                fontWeight: '600',
                fontSize: 16,
              }}
            >
              {userLetter}
            </Text>
          </View>
        </Pressable>
      </LinearGradient>

      {/* Content */}
      <LinearGradient
        colors={[COLORS.background, '#EFE7F6']}
        style={{ flex: 1, padding: 20 }}
      >
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </LinearGradient>
    </View>
  );
}
