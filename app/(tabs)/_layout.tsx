// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol"; // Assuming you have this
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const { user, loading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login"); // Go back to login screen
    }
  }, [user, loading]);

  if (!user) {
    return null; // Important: Don't render tabs if not logged in
  }

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
