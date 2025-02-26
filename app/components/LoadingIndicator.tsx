// components/LoadingIndicator.tsx
import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

interface LoadingIndicatorProps {
  message?: string;
}

export default function LoadingIndicator({
  message = "Loading...",
}: LoadingIndicatorProps) {
  const colorScheme = useColorScheme() || "light";
  const colors = Colors[colorScheme];

  return (
    <ThemedView style={styles.container}>
      <ActivityIndicator size="large" color={colors.tint} />
      {message ? (
        <ThemedText style={styles.loadingText}>{message}</ThemedText>
      ) : null}
    </ThemedView>
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
