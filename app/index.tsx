
import React from 'react';
import { View, Button } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from './hooks/useAuth';
import ThemedView from './components/ThemedView';
import ThemedText from './components/ThemedText';

export default function Index() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText style={{ fontSize: 20, marginBottom: 20 }}>Welcome to the App!</ThemedText>
      
      {user ? (
        <View style={{ alignItems: 'center' }}>
          <ThemedText style={{ marginBottom: 20 }}>Logged in as: {user.username}</ThemedText>
          <Button title="Logout" onPress={handleLogout} />
          <Link href="/(tabs)" style={{ marginTop: 20, color: 'blue' }}>
            <Text>Go to Tabs</Text>
          </Link>
        </View>
      ) : (
        <Link href="/login" style={{ color: 'blue' }}>
          <Text>Login</Text>
        </Link>
      )}
    </ThemedView>
  );
}
