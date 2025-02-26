// components/AuthForm.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Link } from "expo-router";

interface AuthFormProps {
  type: "login" | "register";
  onSubmit: (
    username: string,
    password: string,
    email?: string,
  ) => Promise<void>;
}

export function AuthForm({ type, onSubmit }: AuthFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (type === "register" && password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    try {
      if (type === "register") {
        await onSubmit(username, password, email);
      } else {
        await onSubmit(username, password);
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    }
  };

  return (
    <View style={styles.formContainer}>
      <ThemedText type="title">
        {type === "login" ? "Login" : "Register"}
      </ThemedText>
      {error ? (
        <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
      ) : null}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {type === "register" && (
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      {type === "register" && (
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
        />
      )}
      <Button
        title={type === "login" ? "Login" : "Register"}
        onPress={handleSubmit}
      />
      {type === "login" && (
        <Link href="/register" style={styles.link}>
          <ThemedText type="link">Register</ThemedText>
        </Link>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  link: {
    marginTop: 15,
  },
});

export default AuthForm;
