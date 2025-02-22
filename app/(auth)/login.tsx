
// app/(auth)/login.tsx
import { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { router } from "expo-router";
import { Link } from "expo-router";
import ThemedView from "../components/ThemedView";
import ThemedText from "../components/ThemedText";
import AuthForm from "../components/AuthForm";

export default function LoginScreen() {
    const { login, user, loading } = useAuth();
    const [error, setError] = useState("");
    // router is imported directly from expo-router

    // Redirect if already logged in
    useEffect(() => {
        if (!loading && user) {
            router.replace("/(tabs)/");
        }
    }, [user, loading]);

    const handleLogin = async (username: string, password: string) => {
        try {
            await login(username, password);
        } catch (e: any) {
            setError(e.message);
            Alert.alert("Login Failed", e.message);
        }
    };

    if (loading || user) {
        return null;
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Login Page</ThemedText>
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
