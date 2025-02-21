// components/ErrorMessage.tsx
import React from "react";
import { Text, StyleSheet } from "react-native";

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  // Changed: Added 'export default'
  return <Text style={styles.error}>{message}</Text>;
}

const styles = StyleSheet.create({
  error: {
    color: "red",
    marginBottom: 10,
  },
});
