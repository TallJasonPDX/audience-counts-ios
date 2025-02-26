// app/hooks/useAuth.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { Platform } from "react-native";
import useApi from "./useApi";

// Define proper user type
type User = {
  id: string;
  username: string;
  email?: string;
  // Add other user properties as needed
} | null;

interface AuthContextType {
  user: User;
  loading: boolean;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Storage implementation for web
const webStorage = {
  async getItemAsync(key: string) {
    return localStorage.getItem(key);
  },
  async setItemAsync(key: string, value: string) {
    localStorage.setItem(key, value);
    return true;
  },
  async deleteItemAsync(key: string) {
    localStorage.removeItem(key);
    return true;
  },
};

// Use appropriate storage implementation based on platform
const storage = Platform.OS === "web" ? webStorage : SecureStore;

// Create auth context
const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const api = useApi();

  // Fetch user info from API
  const fetchUserInfo = useCallback(
    async (authToken: string) => {
      try {
        // Call your user info endpoint
        const userInfo = await api.get("/auth/me", authToken);
        setUser({
          id: userInfo.id.toString(),
          username: userInfo.username,
          email: userInfo.email,
          // Add other user properties as needed
        });
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        // If we can't get user info, clear the token and user
        await storage.deleteItemAsync("authToken");
        setToken(null);
        setUser(null);
      }
    },
    [api],
  );

  // Load the auth token and user info on startup
  const loadAuth = useCallback(async () => {
    setLoading(true);
    try {
      const storedToken = await storage.getItemAsync("authToken");
      if (storedToken) {
        setToken(storedToken);
        await fetchUserInfo(storedToken);
      }
    } catch (error) {
      console.error("Error loading auth state:", error);
      // Clear auth state on error
      await storage.deleteItemAsync("authToken");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [fetchUserInfo]);

  // Load auth state on component mount
  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  // Login function
  const login = useCallback(
    async (username: string, password: string) => {
      try {
        setLoading(true);
        // Make the login request
        const response = await api.post("/auth/token", { username, password });
        const newToken = response.access_token;

        // Store the token in secure storage
        await storage.setItemAsync("authToken", newToken);
        setToken(newToken);

        // Fetch the user information
        await fetchUserInfo(newToken);

        // Fixed navigation path - use direct path instead of dynamic one
        router.replace("/(tabs)");
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [api, fetchUserInfo],
  );

  // Logout function
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      // Clear the auth token from storage
      await storage.deleteItemAsync("authToken");

      // Clear the auth state
      setToken(null);
      setUser(null);

      // Fixed navigation path
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Context value
  const value = {
    user,
    loading,
    token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;