
import { View, Text } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from './hooks/useAuth';
import { useEffect } from 'react';

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading]);

  if (loading || !user) {
    return null;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Welcome to the App!</Text>
      <Link href="/(tabs)" style={{ color: 'blue' }}>
        <Text>Go to Tabs</Text>
      </Link>
    </View>
  );
}
