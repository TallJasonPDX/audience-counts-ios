// hooks/useAuth.ts
import { useState, useEffect, createContext, useContext } from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { useApi } from "./useApi";

interface AuthContextProps {
  user: any | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>; // Correct: Promise<void>
  logout: () => Promise<void>; // Correct: Promise<void>
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  token: null,
  // Corrected default values:  These must match the interface!
  login: () => Promise.resolve(), // Resolves immediately
  logout: () => Promise.resolve(), // Resolves immediately
  loading: true,
});

export default function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { post } = useApi();

  useEffect(() => {
    async function loadToken() {
      const storedToken = await SecureStore.getItemAsync("authToken");
      if (storedToken) {
        setToken(storedToken);
        // TODO:  Validate token with backend (e.g., call /api/auth/me)
        // If valid, setUser(userData);
        // If invalid, setToken(null); and possibly redirect to login
      }
      setLoading(false);
    }
    loadToken();
  }, []);

  const login = async (username: string, password: string) => {
    // Keep as async
    const response = await post("/auth/token", {
      // Use the correct endpoint
      username: username,
      password: password,
    });

    const newToken = response.access_token;

    if (newToken) {
      await SecureStore.setItemAsync("authToken", newToken);
      setToken(newToken);
      // You might want to fetch the user data here, after successful login
      // const userData = await fetchUserData(newToken); // Implement fetchUserData
      // setUser(userData);
      setUser({ username }); // For now, just set the username.  In a real app, fetch user data.
      router.replace("/rn-audiences"); // Or your desired home route
    } else {
      throw new Error("Login failed: No token received."); // More specific error
    }
  };

  const logout = async () => {
    // Keep as async
    await SecureStore.deleteItemAsync("authToken");
    setToken(null);
    setUser(null);
    router.replace("/login");
  };

  return AuthContext;
}
