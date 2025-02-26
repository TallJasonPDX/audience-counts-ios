
import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from './hooks/useAuth';
import ThemedView from './components/ThemedView';
import ThemedText from './components/ThemedText';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  }
});

export default function Index() {
  const { user, logout } = useAuth();
  console.log('Current user state:', user);
  console.log('Rendering Index component');

  return (
    <ThemedView style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <ThemedText style={{ fontSize: 24, marginBottom: 20 }}>Welcome to the App!</ThemedText>
      
      {user ? (
        <View style={{ alignItems: 'center', gap: 20 }}>
          <ThemedText>Logged in as: {user.username}</ThemedText>
          <Pressable style={styles.button} onPress={() => router.push('/(tabs)')}>
            <ThemedText>Go to Dashboard</ThemedText>
          </Pressable>
          <Pressable style={styles.button} onPress={logout}>
            <ThemedText>Logout</ThemedText>
          </Pressable>
        </View>
      ) : (
        <View style={styles.container}>
          <ThemedText>Please log in to continue</ThemedText>
          <Pressable 
            style={styles.button} 
            onPress={() => router.push('/(auth)/login')}
          >
            <ThemedText>Login</ThemedText>
          </Pressable>
          <Pressable 
            style={styles.button}
            onPress={() => router.push('/(auth)/register')}
          >
            <ThemedText>Register</ThemedText>
          </Pressable>
        </View>
      )}
    </ThemedView>
  );
}
