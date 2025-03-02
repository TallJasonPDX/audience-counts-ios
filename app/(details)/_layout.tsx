import { Stack } from "expo-router";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useRef } from "react";
import { router } from "expo-router";
import LoadingIndicator from "../components/LoadingIndicator";

export default function DetailsLayout() {
  const { user, loading } = useAuth();
  const hasRedirected = useRef(false);

  // Redirect to login if not authenticated - but only once
  useEffect(() => {
    if (!loading && !user && !hasRedirected.current) {
      hasRedirected.current = true;
      router.replace("/login");
    }
  }, [user, loading]);

  // Show loading indicator while checking auth state
  if (loading) {
    return <LoadingIndicator message="Loading..." />;
  }

  // Don't render if not logged in
  if (!user) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen
        name="rn-audiences/[id]"
        options={{ title: "RN Audience Details" }}
      />
      <Stack.Screen
        name="rn-audiences/create"
        options={{ title: "Create RN Audience" }}
      />
      <Stack.Screen
        name="hcp-audiences/[id]"
        options={{ title: "HCP Audience Details" }}
      />
      <Stack.Screen
        name="hcp-audiences/create"
        options={{ title: "Create HCP Audience" }}
      />
    </Stack>
  );
}
