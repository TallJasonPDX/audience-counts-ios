// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { useEffect } from "react";
import { router } from "expo-router";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";
import { ThemedView } from "../components/ThemedView";
import { ThemedText } from "../components/ThemedText";

export default function TabLayout() {
  const { user, loading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      // Only redirect if we've checked auth state and user is not logged in
      router.replace("/login");
    }
  }, [user, loading]);

  // Show loading indicator while checking auth state
  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Loading...</ThemedText>
      </ThemedView>
    );
  }

  // Don't render the tab navigator if not logged in
  if (!user) {
    return null;
  }

  // User is authenticated, render the tab navigator
  return (
    <Tabs>
      <Tabs.Screen
        name="rn-audiences"
        options={{
          title: "RN Audiences",
          tabBarIcon: ({ color }) => (
            <Ionicons name="people" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="hcp-audiences"
        options={{
          title: "HCP Audiences",
          tabBarIcon: ({ color }) => (
            <Ionicons name="medkit" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="logout"
        options={{
          title: "Logout",
          tabBarIcon: ({ color }) => (
            <Ionicons name="log-out" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
  },
});
