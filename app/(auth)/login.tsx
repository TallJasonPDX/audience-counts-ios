import { View } from "react-native";
import { useAuth } from "../hooks/useAuth";
import AuthForm from "../components/AuthForm";
import { Link } from "expo-router";


export default function LoginScreen() {
    const { login } = useAuth();

    const handleLogin = async (username: string, password: string) => {
        try {
            await login(username, password);
        } catch (e: any) {
            console.error("Login error:", e.message);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
            <AuthForm type="login" onSubmit={handleLogin} />
            <Link href="/register" style={{marginTop: 15}}>
                <Text style={{ color: 'blue' }}>Register</Text>
            </Link>
        </View>
    );
}