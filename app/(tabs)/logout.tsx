// app/(tabs)/logout.tsx
import { useEffect } from "react";
import { router } from "expo-router";
import { useAuth } from "../hooks/useAuth";
import { View, Text, ActivityIndicator } from "react-native";
import { ThemedView } from "../components/ThemedView";

export default function LogoutScreen() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text>Logging out...</Text>
      <ActivityIndicator size="large" />
    </ThemedView>
  );
}
