// components/ui/TabBarBackground.tsx
import React from "react";
import { View, StyleSheet } from "react-native";

export default function TabBarBackground() {
  // Added export default
  // Provide a default, cross-platform background.
  // This could be a simple View with a background color,
  // or a more complex component if needed.
  return <View style={styles.background} />;
}

export function useBottomTabOverflow() {
  return 0;
}

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 100, // Or whatever height you need
    backgroundColor: "#f0f0f0", // A default background color
  },
});
