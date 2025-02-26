// app/(auth)/login.tsx
import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Button from "../components/Button";
import Input from "../components/Input";

export default function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMsg("Please enter both username and password");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg("");
      await login(username, password);
    } catch (e: any) {
      setErrorMsg(e.message || "Login failed. Please check your credentials.");
      Alert.alert(
        "Login Failed",
        e.message || "Please check your credentials and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>A</Text>
          </View>
          <Text style={styles.appName}>Audience Synergy</Text>
          <Text style={styles.appTagline}>
            Manage your RN and HCP audiences effectively
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Sign In</Text>

          <Input
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
            autoCapitalize="none"
            autoCorrect={false}
            icon="person-outline"
            error={errorMsg && !username ? "Username is required" : ""}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            autoCapitalize="none"
            icon="lock-closed-outline"
            error={errorMsg && !password ? "Password is required" : ""}
          />

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <Button
            title="SIGN IN"
            onPress={handleLogin}
            isLoading={isLoading}
            disabled={isLoading}
            size="large"
            style={styles.loginButton}
          />
        </View>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account?</Text>
          <Link href="/(auth)/register" style={styles.registerLink}>
            <Text style={styles.registerLinkText}>Register</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 36,
    color: "white",
    fontWeight: "bold",
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 6,
  },
  appTagline: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
  },
  errorText: {
    color: "#ef4444",
    marginBottom: 12,
    fontSize: 14,
  },
  loginButton: {
    marginTop: 8,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    color: "#64748b",
    fontSize: 14,
  },
  registerLink: {
    marginLeft: 4,
  },
  registerLinkText: {
    color: "#3b82f6",
    fontWeight: "500",
    fontSize: 14,
  },
});
