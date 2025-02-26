// app/(auth)/login.tsx
import { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { Link } from "expo-router";
import { ThemedView } from "../components/ThemedView";
import { ThemedText } from "../components/ThemedText";
import AuthForm from "../components/AuthForm";

export default function LoginScreen() {
    const { login } = useAuth();
    const [error, setError] = useState("");

    const handleLogin = async (username: string, password: string) => {
        try {
            await login(username, password);
        } catch (e: any) {
            setError(e.message);
            Alert.alert("Login Failed", e.message);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <AuthForm type="login" onSubmit={handleLogin} />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
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
