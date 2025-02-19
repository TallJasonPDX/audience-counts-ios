// hooks/useApi.ts
import { useState, useCallback } from "react";
import { API_BASE_URL } from "@/constants/api";
import { useAuth } from "./useAuth";

export function useApi() {
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const makeRequest = useCallback(
        async (
            method: "GET" | "POST" | "PUT" | "DELETE",
            url: string,
            data?: any,
        ) => {
            setIsLoading(true);
            setError(null);
            try {
                const headers: HeadersInit = {
                    "Content-Type": "application/json",
                };
                if (token) {
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
        [token],
    );

    const get = useCallback(
        (url: string) => makeRequest("GET", url),
        [makeRequest],
    );
    const post = useCallback(
        (url: string, data: any) => makeRequest("POST", url, data),
        [makeRequest],
    );
    const put = useCallback(
        (url: string, data: any) => makeRequest("PUT", url, data),
        [makeRequest],
    );
    const del = useCallback(
        (url: string) => makeRequest("DELETE", url),
        [makeRequest],
    ); // Use 'del' instead of 'delete'

    return { get, post, put, del, isLoading, error }; // Return 'del'
}
