
import React from 'react';
import { View, Button, Text } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from './hooks/useAuth';
import ThemedView from './components/ThemedView';
import ThemedText from './components/ThemedText';

export default function Index() {
  const { user, logout } = useAuth();
  console.log('Current user state:', user);

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
          <Link href="/(tabs)" asChild>
            <Button title="Go to Tabs" />
          </Link>
        </View>
      ) : (
        <Link href="/(auth)/login" asChild>
          <Button title="Login" />
        </Link>
      )}
    </ThemedView>
  );
}
