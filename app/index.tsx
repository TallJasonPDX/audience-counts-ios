// app/index.tsx
import { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "./hooks/useAuth";
import LoadingIndicator from "./components/LoadingIndicator";

export default function Index() {
  const { user, loading } = useAuth();
  const hasRedirected = useRef(false);

  // Show loading indicator while checking authentication
  if (loading) {
    return <LoadingIndicator message="Loading Audience Synergy..." />;
  }

  // Use Redirect component instead of programmatic navigation
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