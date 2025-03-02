// app/hooks/useAuth.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
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
  const isMounted = useRef(true);
  const userInfoRequestInProgress = useRef(false);
  const lastFetchTime = useRef(0);
  const authLoadComplete = useRef(false);

  // Simple debounce function to prevent multiple rapid calls
  const debounce = (func: Function, delay: number) => {
    const now = Date.now();
    if (now - lastFetchTime.current > delay) {
      lastFetchTime.current = now;
      func();
    }
  };

  // Fetch user info from API
  const fetchUserInfo = useCallback(
    async (authToken: string) => {
      // Prevent duplicate requests or requests too close together
      if (userInfoRequestInProgress.current) return;

      try {
        userInfoRequestInProgress.current = true;
        console.log("Fetching user info...");

        // Call your user info endpoint
        const userInfo = await api.get("/auth/me", authToken);

        if (isMounted.current) {
          setUser({
            id: userInfo.id.toString(),
            username: userInfo.username,
            email: userInfo.email,
            // Add other user properties as needed
          });
          console.log("User info fetched successfully");
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        // If we can't get user info, clear the token and user
        if (isMounted.current) {
          await storage.deleteItemAsync("authToken");
          setToken(null);
          setUser(null);
        }
      } finally {
        userInfoRequestInProgress.current = false;
      }
    },
    [api],
  );

  // Load the auth token and user info on startup
  const loadAuth = useCallback(async () => {
    // Skip if already completed or in progress
    if (authLoadComplete.current || !isMounted.current || userInfoRequestInProgress.current) {
      return;
    }

    try {
      setLoading(true);
      console.log("Loading auth state...");

      const storedToken = await storage.getItemAsync("authToken");
      if (storedToken && isMounted.current) {
        console.log("Token found, setting token state");
        setToken(storedToken);
        await fetchUserInfo(storedToken);
      } else {
        console.log("No token found");
        if (isMounted.current) {
          setUser(null);
          setToken(null);
        }
      }

      // Mark auth loading as complete
      authLoadComplete.current = true;

    } catch (error) {
      console.error("Error loading auth state:", error);
      // Clear auth state on error
      if (isMounted.current) {
        await storage.deleteItemAsync("authToken");
        setToken(null);
        setUser(null);
      }
    } finally {
      if (isMounted.current) {
        console.log("Auth loading complete");
        setLoading(false);
      }
    }
  }, [fetchUserInfo]);

  // Load auth state on component mount - only once
  useEffect(() => {
    isMounted.current = true;

    // Use debouncing to prevent multiple calls
    debounce(() => {
      loadAuth();
    }, 300);

    return () => {
      isMounted.current = false;
    };
  }, [loadAuth]);

  // Modified login function in useAuth.tsx
  const login = useCallback(
    async (username: string, password: string) => {
      if (!isMounted.current) return;

      try {
        setLoading(true);
        // Reset auth load complete to force a fresh check
        authLoadComplete.current = false;

        console.log("Attempting login...");

        // Make the login request
        const response = await api.post("/auth/token", { username, password });
        const newToken = response.access_token;

        if (isMounted.current) {
          console.log("Login successful, setting token");
          // Store the token in secure storage
          await storage.setItemAsync("authToken", newToken);
          setToken(newToken);

          // Fetch the user information
          await fetchUserInfo(newToken);

          console.log("Navigating to dashboard...");

          // Force a small delay to ensure state is updated before navigation
          setTimeout(() => {
            if (isMounted.current) {
              // Use replace instead of navigate to prevent going back to login
              router.replace("/(tabs)");
            }
          }, 100);
        }
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    },
    [api, fetchUserInfo],
  );

  // Logout function
  const logout = useCallback(async () => {
    if (!isMounted.current) return;

    try {
      setLoading(true);
      // Reset auth load complete to force a fresh check on next login
      authLoadComplete.current = false;

      // Clear the auth token from storage
      await storage.deleteItemAsync("authToken");

      if (isMounted.current) {
        // Clear the auth state
        setToken(null);
        setUser(null);

        // Navigate to login
        router.replace("/login"); //This line was changed.
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
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