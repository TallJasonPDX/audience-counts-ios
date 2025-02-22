
import React, { useState, useEffect, createContext, useContext } from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import useApi from "./useApi";
import { Platform } from 'react-native';

const webStorage = {
  async getItemAsync(key: string) {
    return localStorage.getItem(key);
  },
  async setItemAsync(key: string, value: string) {
    return localStorage.setItem(key, value);
  },
  async deleteItemAsync(key: string) {
    return localStorage.removeItem(key);
  },
};

const storage = Platform.OS === 'web' ? webStorage : SecureStore;

type User = {
  id: string;
  username: string;
} | null;

interface AuthContextType {
  user: User;
  loading: boolean;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function useAuth() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const api = useApi();

  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    try {
      const storedToken = await storage.getItemAsync("authToken");
      if (storedToken) {
        setToken(storedToken);
        setUser({ id: '1', username: 'user' }); // Set user data based on token
      }
    } catch (error) {
      console.error("Error loading token:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { username, password });
      const newToken = response.token;
      await storage.setItemAsync("authToken", newToken);
      setToken(newToken);
      setUser({ id: '1', username }); // Set user data based on login response
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    await storage.deleteItemAsync("authToken");
    setToken(null);
    setUser(null);
    router.replace("/");
  };

  return { user, loading, token, login, logout };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
