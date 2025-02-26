
import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Welcome to the App!</Text>
      <Link href="/(tabs)" style={{ color: 'blue' }}>
        <Text>Go to Tabs</Text>
      </Link>
    </View>
  );
}
