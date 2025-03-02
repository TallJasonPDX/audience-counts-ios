
// hooks/useApi.ts
import { useState, useCallback, useRef } from "react";
import { API_BASE_URL } from "../constants/api";

// Create a type for the API response
type ApiResponse<T> = {
  data: T | null;
  error: string | null;
};

export default function useApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pendingRequests = useRef(new Map());

  const makeRequest = useCallback(
    async <T>(
      method: string,
      url: string,
      token?: string | null,
      data?: any
    ): Promise<ApiResponse<T>> => {
      const endpoint = `${API_BASE_URL}${url}`;
      const requestKey = `${method}:${endpoint}:${JSON.stringify(data)}`;

      // Check if we have a pending request for this exact endpoint
      if (pendingRequests.current.has(requestKey)) {
        return pendingRequests.current.get(requestKey);
      }

      setIsLoading(true);
      setError(null);

      const requestPromise = (async () => {
        try {
          // Set up headers with content type and auth token if provided
          const headers: Record<string, string> = {
            "Content-Type": "application/json",
          };

          if (token) {
            headers["Authorization"] = `Bearer ${token}`;
            // Only log that we're using a token, not any part of the actual token
            console.log(`Making ${method} request to ${endpoint} with auth: Yes`);
          } else {
            console.log(`Making ${method} request to ${endpoint} with auth: No`);
          }

          let body = undefined;
          if (data) {
            body = JSON.stringify(data);
          }

          // Make the fetch request
          const response = await fetch(endpoint, {
            method,
            headers,
            body,
          });

          // Handle non-200 responses
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.log(`API error (${response.status}):`, errorData);
            
            if (response.status === 401) {
              console.log(`Authentication failed for ${url}. Token present: ${Boolean(token)}`);
            }
            
            const errorMessage =
              errorData.detail ||
              `Request failed with status ${response.status}`;
            throw new Error(errorMessage);
          }

          // Parse and return the response data
          const responseData = await response.json();
          return { data: responseData, error: null };
        } catch (err: any) {
          console.log("API Request Failed:", err);
          const errorMessage = err.message || "An unknown error occurred";
          setError(errorMessage);
          return { data: null, error: errorMessage };
        } finally {
          setIsLoading(false);
          // Remove this request from pending requests
          pendingRequests.current.delete(requestKey);
        }
      })();

      // Store this request promise in our pending requests Map
      pendingRequests.current.set(requestKey, requestPromise);
      return requestPromise;
    },
    []
  );

  // Helper methods for different HTTP verbs
  const get = useCallback(
    <T>(url: string, token?: string | null): Promise<ApiResponse<T>> => {
      return makeRequest<T>("GET", url, token);
    },
    [makeRequest]
  );

  const post = useCallback(
    <T>(
      url: string,
      data: any,
      token?: string | null
    ): Promise<ApiResponse<T>> => {
      return makeRequest<T>("POST", url, token, data);
    },
    [makeRequest]
  );

  const put = useCallback(
    <T>(
      url: string,
      data: any,
      token?: string | null
    ): Promise<ApiResponse<T>> => {
      return makeRequest<T>("PUT", url, token, data);
    },
    [makeRequest]
  );

  const del = useCallback(
    <T>(url: string, token?: string | null): Promise<ApiResponse<T>> => {
      return makeRequest<T>("DELETE", url, token);
    },
    [makeRequest]
  );

  return {
    get,
    post,
    put,
    del,
    isLoading,
    error,
  };
}
