
import { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { Link } from "expo-router";
import ThemedView from "../components/ThemedView";
import ThemedText from "../components/ThemedText";
import AuthForm from "../components/AuthForm";

export default function LoginScreen() {
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            await login(username, password);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred during login");
        }
    };

    return (
        <ThemedView style={styles.container}>
            {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
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
    error: {
        color: 'red',
        marginBottom: 10,
    }
});
