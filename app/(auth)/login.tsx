import { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { Link } from "expo-router";
import { ThemedView } from "../components/ThemedView";
import { ThemedText } from "../components/ThemedText";
import AuthForm from "../components/AuthForm"; // ADD THIS LINE

export default function LoginScreen() {
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    return (
        <ThemedView style={styles.container}>
            <AuthForm type="login" onSubmit={login} />
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
