
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { View, Text, ActivityIndicator } from "react-native";
import ThemedView from "../components/ThemedView";

export default function LogoutScreen() {
  const { logout } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout();
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };
    handleLogout();
  }, []);

  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text>Logging out...</Text>
      <ActivityIndicator size="large" />
    </ThemedView>
  );
}
