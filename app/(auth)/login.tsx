import { View, StyleSheet } from "react-native";
import { useAuth } from "../hooks/useAuth";
import ThemedView from "../components/ThemedView";
import AuthForm from "../components/AuthForm";
import { Link } from "expo-router";
import ThemedText from "../components/ThemedText";

export default function LoginScreen() {
  const { login } = useAuth();

  const handleLogin = async (username: string, password: string) => {
    try {
      await login(username, password);
    } catch (e: any) {
      console.error("Login error:", e);
      throw e;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <AuthForm type="login" onSubmit={handleLogin} />
      <Link href="/register" style={styles.link}>
        <ThemedText type="link">Register</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
  },
});