
import { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { Link } from "expo-router";
import { ThemedView } from "../components/ThemedView";
import { ThemedText } from "../components/ThemedText";

export default function LoginScreen() {
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            await login(username, password);
        } catch (e: any) {
            setError(e.message || "Login failed");
            Alert.alert("Login Failed", e.message || "Login failed");
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Login</ThemedText>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
            />
            <Button title="Login" onPress={handleLogin} />
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
