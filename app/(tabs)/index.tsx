
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, Linking, Pressable, Text, View } from 'react-native';
import { getNotifications, Notification, removeNotification, resendMailReviewReminder } from '../../services/notificationApi';



const COLORS = {
  background: '#F6F1EB',
  purpleDark: '#3E1B5E',
  purpleMid: '#6F42A6',
  purpleSoft: '#C9B8E6',
  white: '#FFFFFF',
};

export default function ReminderInbox() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  // 🔁 Load reminders from storage OR API
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
const bringBackMailReviewReminder = async () => {
  await resendMailReviewReminder();
  const updated = await getNotifications();
  setNotifications(updated);
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
        colors={[COLORS.purpleDark, COLORS.purpleMid]}
        style={{
          padding: 20,
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            letterSpacing: 1,
            color: '#E8DDF8',
            marginBottom: 6,
          }}
        >
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

        <Text
          style={{
            color: '#EFE9F7',
            lineHeight: 22,
            marginBottom: 18,
          }}
        >
          {item.description}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Pressable
            onPress={() => Linking.openURL('https://www.google.com')}
            style={{
              backgroundColor: COLORS.white,
              paddingVertical: 10,
              paddingHorizontal: 26,
            }}
          >
            <Text
              style={{
                color: COLORS.purpleDark,
                fontWeight: '500',
              }}
            >
              Yes
            </Text>
          </Pressable>

          <Pressable
            onPress={() => dismiss(item.id)}
            style={{
              backgroundColor: 'rgba(255,255,255,0.25)',
              paddingVertical: 10,
              paddingHorizontal: 26,
            }}
          >
            <Text
              style={{
                color: COLORS.white,
                fontWeight: '500',
              }}
            >
              Cancel
            </Text>
          </Pressable>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  return (
    <LinearGradient
      colors={[COLORS.background, '#EFE7F6']}
      style={{ flex: 1, padding: 20 }}
    >
      {/* Header */}
      <View style={{ marginBottom: 30 }}>
        <LinearGradient
          colors={[COLORS.purpleMid, COLORS.purpleSoft]}
          style={{ height: 4, width: 80, marginBottom: 12 }}
        />
        <Text
          style={{
            fontSize: 26,
            fontWeight: '600',
            color: COLORS.purpleDark,
          }}
        >
          Levelled Checklist Reminder
        </Text>
        <Text style={{ marginTop: 6, color: '#6A5C7A' }}>
          Pending tasks that require your action
        </Text>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
}
