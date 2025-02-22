// app/(auth)/register.tsx
import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import useApi from "../hooks/useApi"; // Import useApi
import { Link, router } from "expo-router";
import ThemedView from "../components/ThemedView";
import ThemedText from "../components/ThemedText";

export default function RegisterScreen() {
    const { post } = useApi(); // Use the useApi hook
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setError("Passwords don't match.");
            Alert.alert("Registration Failed", "Passwords don't match.");
            return;
        }
        setError(""); // Clear previous errors
        setSuccess(false);

        try {
            const response = await post("/auth/register", {
                username,
                email,
                password,
            });
            // Assuming a successful response means registration is pending
            setSuccess(true);
            Alert.alert(
                "Registration Successful",
                "Your registration is pending approval.",
            );
            router.replace("/login");
        } catch (e: any) {
            setError(e.message || "Registration failed");
            Alert.alert(
                "Registration Failed",
                e.message || "Registration failed",
            );
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Register</ThemedText>
            {error ? (
                <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
            ) : null}
            {success && (
                <Text style={{ color: "green", marginBottom: 10 }}>
                    Registration submitted for approval.
                </Text>
            )}
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
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
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
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
            />
            <Button
                title="Register"
                onPress={handleRegister}
                disabled={success}
            />
            <Link href="/login" style={styles.link}>
                <ThemedText type="link">Back to Login</ThemedText>
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
