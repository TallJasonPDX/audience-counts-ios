// components/LoadingIndicator.tsx
import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors"; // Assuming you have Colors defined

export function LoadingIndicator() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.light.tint} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
