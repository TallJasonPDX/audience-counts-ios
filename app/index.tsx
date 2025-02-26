
import React from 'react';
import { View, Button } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from './hooks/useAuth';
import ThemedView from './components/ThemedView';
import ThemedText from './components/ThemedText';

export default function Index() {
  const { user, logout } = useAuth();
  console.log('Current user state:', user);

  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <ThemedText style={{ fontSize: 24, marginBottom: 20 }}>Welcome to the App!</ThemedText>
      
      {user ? (
        <View style={{ alignItems: 'center', gap: 20 }}>
          <ThemedText>Logged in as: {user.username}</ThemedText>
          <Button title="Go to Dashboard" onPress={() => router.push('/(tabs)')} />
          <Button title="Logout" onPress={logout} />
        </View>
      ) : (
        <View style={{ alignItems: 'center', gap: 20 }}>
          <ThemedText>Please log in to continue</ThemedText>
          <Button title="Login" onPress={() => router.push('/(auth)/login')} />
          <Button title="Register" onPress={() => router.push('/(auth)/register')} />
        </View>
      )}
    </ThemedView>
  );
}
