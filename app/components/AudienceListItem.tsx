// components/AudienceListItem.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { ThemedText } from "./ThemedText";

interface AudienceListItemProps {
  audience: {
    id: number;
    name: string;
    description?: string;
  };
  type: "rn" | "hcp";
}

export function AudienceListItem({ audience, type }: AudienceListItemProps) {
  const href =
    type === "rn"
      ? `/rn-audiences/${audience.id}`
      : `/hcp-audiences/${audience.id}`;

  return (
    <View style={styles.item}>
      <Link href={href}>
        <ThemedText type="defaultSemiBold">{audience.name}</ThemedText>
      </Link>
      <Text>{audience.description}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
