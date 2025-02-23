// hooks/useApi.ts
import { useState, useCallback } from "react";
import { API_BASE_URL } from "../constants/api";

export default function useApi() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const makeRequest = useCallback(
        async (
            method: "GET" | "POST" | "PUT" | "DELETE",
            url: string,
            data?: any,
            token?: string,
        ) => {
            setIsLoading(true);
            setError(null);
            try {
                const headers: HeadersInit = {};
                if (token) {
                    headers["Authorization"] = `Bearer ${token}`;
                }

                let body = undefined;
                if (data) {
                    if (url === "/auth/token") {
                        // Correctly use data.username and data.password
                        const formData = new URLSearchParams();
                        formData.append("grant_type", "password");
                        formData.append("username", data.username); // Use data.username
                        formData.append("password", data.password); // Use data.password
                        formData.append("scope", "");
                        formData.append("client_id", "");
                        formData.append("client_secret", "");

                        body = formData;
                        headers["Content-Type"] =
                            "application/x-www-form-urlencoded";
                    } else {
                        body = JSON.stringify(data);
                        headers["Content-Type"] = "application/json";
                    }
                }

                const fullUrl = API_BASE_URL + url;
                console.log("API Request:");
                console.log(`  Method: ${method}`);
                console.log(`  URL: ${fullUrl}`);
                console.log(`  Headers:`, headers);
                console.log(`  Body:`, body ? body.toString() : 'undefined');
                console.log(`  Data:`, data ? JSON.stringify(data) : 'undefined');

                const response = await fetch(fullUrl, {
                    method,
                    headers,
                    body,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.log("API Response (Error):", errorData);
                    throw new Error(
                        errorData.detail || `API Error: ${response.statusText}`,
                    );
                }

                const responseData = await response.json();
                console.log("API Response (Success):", responseData);
                return responseData;
            } catch (e: any) {
                console.error("API Request Failed:", e);
                setError(e.message || "An unexpected error occurred.");
                throw e;
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    const get = useCallback(
        (url: string, token?: string) =>
            makeRequest("GET", url, undefined, token),
        [makeRequest],
    );
    const post = useCallback(
        (url: string, data: any, token?: string) =>
            makeRequest("POST", url, data, token),
        [makeRequest],
    );
    const put = useCallback(
        (url: string, data: any, token?: string) =>
            makeRequest("PUT", url, data, token),
        [makeRequest],
    );
    const del = useCallback(
        (url: string, token?: string) =>
            makeRequest("DELETE", url, undefined, token),
        [makeRequest],
    );

    return { get, post, put, del, isLoading, error };
}
