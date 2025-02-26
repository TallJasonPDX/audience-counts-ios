// app/(tabs)/logout.tsx
import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";

export default function LogoutScreen() {
  const { logout } = useAuth();

  // Call logout as soon as this screen renders
  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
        // The navigation is handled inside the logout function
        // so we don't need to call router.replace here
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };

    performLogout();
  }, [logout]);

  // This screen will only be briefly visible during logout
  return (
    <ThemedView style={styles.container}>
      <ThemedText>Logging out...</ThemedText>
      <ActivityIndicator size="large" style={styles.spinner} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    marginTop: 20,
  },
});
