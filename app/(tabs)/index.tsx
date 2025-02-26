// app/(tabs)/index.tsx
import { StyleSheet } from "react-native";
import HelloWave from "../components/HelloWave";
import ThemedText from "../components/ThemedText";
import ThemedView from "../components/ThemedView";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { useAuth } from "../hooks/useAuth";

export default function TabIndexScreen() {
  const { user } = useAuth();
  const colorScheme = useColorScheme() || "light";
  const colors = Colors[colorScheme];

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Audience Synergy</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedText style={styles.welcomeText}>
        Welcome back, {user?.username || "User"}!
      </ThemedText>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Dashboard Overview</ThemedText>
        <ThemedText style={styles.cardText}>
          Use the tabs below to manage your RN and HCP audiences.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Quick Tips</ThemedText>
        <ThemedText style={styles.cardText}>
          • Create separate audiences for RN and HCP targets
        </ThemedText>
        <ThemedText style={styles.cardText}>
          • Use geographic filters to target specific regions
        </ThemedText>
        <ThemedText style={styles.cardText}>
          • Combine specialties and states for precision targeting
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 24,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardText: {
    marginTop: 8,
  }
});