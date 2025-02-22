import React, { useState, useEffect, createContext, useContext } from "react";
import SecureStore from "expo-secure-store";
import { router } from "expo-router";
import useApi from "./useApi";

interface AuthContextProps {
  user: any | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  token: null,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  loading: true,
});

export function useAuth() {
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
      }
      setLoading(false);
    }
    loadToken();
  }, []);

  const login = async (username: string, password: string) => {
    const response = await post("/auth/token", {
      username: username,
      password: password,
    });

    const newToken = response.access_token;

    if (newToken) {
      await SecureStore.setItemAsync("authToken", newToken);
      setToken(newToken);
      setUser({ username });
      router.replace("/rn-audiences");
    } else {
      throw new Error("Login failed: No token received.");
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("authToken");
    setToken(null);
    setUser(null);
    router.replace("/login");
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { user, token, login, logout, loading } },
    children,
  );
}

export default useAuth;
