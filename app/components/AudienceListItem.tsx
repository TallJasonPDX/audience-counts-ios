// components/AudienceListItem.tsx
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

interface AudienceListItemProps {
  audience: {
    id: number;
    name: string;
    description?: string | null;
    created_at?: string;
  };
  type: "rn" | "hcp";
}

export default function AudienceListItem({
  audience,
  type,
}: AudienceListItemProps) {
  const colorScheme = useColorScheme() || "light";
  const colors = Colors[colorScheme];

  const href =
    type === "rn"
      ? `/(details)/rn-audiences/${audience.id}`
      : `/(details)/hcp-audiences/${audience.id}`;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <ThemedView style={styles.item}>
      <View style={styles.content}>
        <Link href={href} asChild>
          <TouchableOpacity activeOpacity={0.7}>
            <ThemedText type="defaultSemiBold" style={styles.audienceName}>
              {audience.name}
            </ThemedText>
          </TouchableOpacity>
        </Link>

        {audience.description && (
          <ThemedText numberOfLines={2} style={styles.description}>
            {audience.description}
          </ThemedText>
        )}

        {audience.created_at && (
          <ThemedText style={styles.date}>
            Created: {formatDate(audience.created_at)}
          </ThemedText>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  content: {
    flex: 1,
  },
  audienceName: {
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    opacity: 0.6,
  },
});
