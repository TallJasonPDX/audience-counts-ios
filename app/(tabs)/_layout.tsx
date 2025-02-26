// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { useEffect, useRef } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";
import LoadingIndicator from "../components/LoadingIndicator";

export default function TabLayout() {
  const { user, loading } = useAuth();
  const hasRedirected = useRef(false);

  // Redirect to login if not authenticated - but only once
  useEffect(() => {
    if (!loading && !user && !hasRedirected.current) {
      hasRedirected.current = true;
      router.replace("/(auth)/login");
    }
  }, [user, loading]);

  // Show loading indicator while checking auth state
  if (loading) {
    return <LoadingIndicator message="Loading..." />;
  }

  // Don't render the tab navigator if not logged in
  if (!user) {
    return null;
  }

  // User is authenticated, render the tab navigator
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rn-audiences/index"
        options={{
          title: "RN Audiences",
          tabBarIcon: ({ color }) => (
            <Ionicons name="people" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="hcp-audiences/index"
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