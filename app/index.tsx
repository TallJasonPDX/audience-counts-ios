// app/index.tsx
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { router, Redirect } from "expo-router";
import { useAuth } from "./hooks/useAuth";
import ThemedView from "./components/ThemedView";
import ThemedText from "./components/ThemedText";
import LoadingIndicator from "./components/LoadingIndicator";

export default function Index() {
  const { user, loading } = useAuth();

  // Show loading indicator while checking authentication
  if (loading) {
    return <LoadingIndicator message="Loading Audience Synergy..." />;
  }

  // Instead of programmatic navigation with hooks, use Redirect component
  // This is more reliable in Expo Router
  if (user) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
  },
});
