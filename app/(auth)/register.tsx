// app/(auth)/register.tsx
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
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import useApi from "../hooks/useApi";
import Button from "../components/Button";
import Input from "../components/Input";

export default function RegisterScreen() {
    const { post } = useApi();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleRegister = async () => {
        // Form validation
        if (!username || !email || !password || !confirmPassword) {
            setError("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setError("");
        setSuccess(false);
        setIsLoading(true);

        try {
            const response = await post("/auth/register", {
                username,
                email,
                password,
            });

            setSuccess(true);
            Alert.alert(
                "Registration Successful",
                "Your registration is pending approval. You can now log in.",
                [{ text: "OK", onPress: () => router.replace("/login") }],
            );
        } catch (e: any) {
            setError(e.message || "Registration failed");
            Alert.alert(
                "Registration Failed",
                e.message || "Please try again later.",
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
                        Create your account to get started
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.formTitle}>Create Account</Text>

                    {success && (
                        <Text style={styles.successText}>
                            Registration successful!
                        </Text>
                    )}

                    <Input
                        label="Username"
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Choose a username"
                        autoCapitalize="none"
                        autoCorrect={false}
                        icon="person-outline"
                        error={error ? error : ""}
                    />

                    <Input
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        icon="mail-outline"
                    />

                    <Input
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Create a password"
                        secureTextEntry
                        autoCapitalize="none"
                        icon="lock-closed-outline"
                    />

                    <Input
                        label="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirm your password"
                        secureTextEntry
                        autoCapitalize="none"
                        icon="lock-closed-outline"
                    />

                    <Button
                        title="CREATE ACCOUNT"
                        onPress={handleRegister}
                        isLoading={isLoading}
                        disabled={isLoading || success}
                        size="large"
                        style={styles.registerButton}
                    />
                </View>

                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>
                        Already have an account?
                    </Text>
                    <Link href="/login" style={styles.loginLink}>
                        <Text style={styles.loginLinkText}>Sign In</Text>
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
        marginBottom: 32,
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
    successText: {
        color: "#10b981",
        marginBottom: 12,
        fontSize: 14,
    },
    registerButton: {
        marginTop: 8,
    },
    loginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    loginText: {
        color: "#64748b",
        fontSize: 14,
    },
    loginLink: {
        marginLeft: 4,
    },
    loginLinkText: {
        color: "#3b82f6",
        fontWeight: "500",
        fontSize: 14,
    },
});
