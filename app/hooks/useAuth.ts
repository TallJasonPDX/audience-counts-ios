
import React, { useState, useEffect, createContext, useContext } from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import useApi from "./useApi";
import { Platform } from 'react-native';

// Web fallback
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

// Use SecureStore for native platforms, localStorage for web
const storage = Platform.OS === 'web' ? webStorage : SecureStore;

interface AuthContextType {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    async function loadToken() {
      const storedToken = await storage.getItemAsync("authToken");
      if (storedToken) {
        setToken(storedToken);
      }
    }
    loadToken();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { username, password });
      const newToken = response.token;
      await storage.setItemAsync("authToken", newToken);
      setToken(newToken);
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    await storage.deleteItemAsync("authToken");
    setToken(null);
    router.replace("/");
  };

  return { token, login, logout };
}

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();
  return React.createElement(AuthContext.Provider, { value: auth }, children);
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
