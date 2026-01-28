import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function TaskPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 22, marginBottom: 12 }}>
        Task Details
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 8 }}>
        {params.title}
      </Text>

      <Text style={{ color: '#555', marginBottom: 20 }}>
        {params.description}
      </Text>

      <Pressable
        onPress={() => router.back()}
        style={{
          backgroundColor: '#4B1D73',
          padding: 12,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff' }}>Back</Text>
      </Pressable>
    </View>
  );
}
