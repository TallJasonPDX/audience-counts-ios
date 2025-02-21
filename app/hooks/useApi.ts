// hooks/useApi.ts
import { useState, useCallback } from "react";
import { API_BASE_URL } from "../constants/api";
// import { useAuth } from './useAuth'; // REMOVE THIS LINE

export function useApi() {
    // const { token } = useAuth(); // REMOVE THIS LINE
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const makeRequest = useCallback(
        async (
            method: "GET" | "POST" | "PUT" | "DELETE",
            url: string,
            data?: any,
            token?: string, // Add token as an optional parameter
        ) => {
            setIsLoading(true);
            setError(null);
            try {
                const headers: HeadersInit = {
                    "Content-Type": "application/json",
                };
                if (token) {
                    // Use the passed-in token
                    headers["Authorization"] = `Bearer ${token}`;
                }

                const response = await fetch(API_BASE_URL + url, {
                    method,
                    headers,
                    body: data ? JSON.stringify(data) : undefined,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(
                        errorData.detail || `API Error: ${response.statusText}`,
                    );
                }

                return await response.json();
            } catch (e: any) {
                setError(e.message || "An unexpected error occurred.");
                throw e;
            } finally {
                setIsLoading(false);
            }
        },
        [], // No dependency on token anymore
    );

    const get = useCallback(
        (url: string, token?: string) =>
            makeRequest("GET", url, undefined, token), // Pass token
        [makeRequest],
    );
    const post = useCallback(
        (url: string, data: any, token?: string) =>
            makeRequest("POST", url, data, token), // Pass token
        [makeRequest],
    );
    const put = useCallback(
        (url: string, data: any, token?: string) =>
            makeRequest("PUT", url, data, token), // Pass token
        [makeRequest],
    );
    const del = useCallback(
        (url: string, token?: string) =>
            makeRequest("DELETE", url, undefined, token), // Pass token
        [makeRequest],
    );

    return { get, post, put, del, isLoading, error };
}
