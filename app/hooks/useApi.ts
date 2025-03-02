// hooks/useApi.ts
import { useState, useCallback, useRef } from "react";
import { API_BASE_URL } from "../constants/api";
import { useAuth } from "./useAuth";

export default function useApi() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const pendingRequests = useRef(new Map());
    const auth = useAuth();

    const makeRequest = useCallback(
        async (
            method: "GET" | "POST" | "PUT" | "DELETE",
            url: string,
            data?: any,
            customToken?: string,
        ) => {
            // Create a unique request key
            const requestKey = `${method}:${url}:${JSON.stringify(data || {})}`;

            // Check if this exact request is already in progress
            if (pendingRequests.current.has(requestKey)) {
                console.log(`Request already in progress: ${requestKey}`);
                return pendingRequests.current.get(requestKey);
            }

            setIsLoading(true);
            setError(null);

            const requestPromise = (async () => {
                try {
                    const headers: HeadersInit = {};
                    // Use provided token or fallback to token from auth context
                    const token = customToken || (auth ? auth.token : null);

                    if (token) {
                        headers["Authorization"] = `Bearer ${token}`;
                        // Only log that we're using a token, not any part of the actual token
                        console.log(`Using token for ${url}: Yes`);
                    }

                    let body = undefined;
                    if (data) {
                        if (url === "/auth/token") {
                            // Correctly use data.username and data.password
                            const formData = new URLSearchParams();
                            formData.append("grant_type", "password");
                            formData.append("username", data.username);
                            formData.append("password", data.password);
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

                    console.log(`Making ${method} request to ${fullUrl} with auth: ${token ? 'Yes' : 'No'}`);

                    // Make the actual API call
                    const response = await fetch(fullUrl, {
                        method,
                        headers,
                        body,
                    });

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        console.error(`API error (${response.status}):`, errorData);

                        // Special handling for authentication errors
                        if (response.status === 401) {
                            console.error(`Authentication failed for ${url}. Token present: ${!!token}`);
                            throw new Error("Not authenticated");
                        }

                        throw new Error(
                            errorData.detail || "An error occurred during the API request"
                        );
                    }

                    const responseData = await response.json();
                    return responseData;
                } catch (e: any) {
                    console.error("API Request Failed:", e);
                    setError(e.message || "An unexpected error occurred.");
                    throw e;
                } finally {
                    setIsLoading(false);
                    // Remove this request from pending requests
                    pendingRequests.current.delete(requestKey);
                }
            })();

            // Store the promise in our pending requests map
            pendingRequests.current.set(requestKey, requestPromise);

            return requestPromise;
        },
        [],
    );

    // GET request
    const get = useCallback(
        (url: string, token = null) => makeRequest("GET", url, null, token),
        [makeRequest],
    );

    // POST request
    const post = useCallback(
        (url: string, data: any, token = null) => makeRequest("POST", url, data, token),
        [makeRequest],
    );

    // PUT request
    const put = useCallback(
        (url: string, data: any, token = null) => makeRequest("PUT", url, data, token),
        [makeRequest],
    );

    // DELETE request
    const del = useCallback(
        (url: string, token = null) => makeRequest("DELETE", url, null, token),
        [makeRequest],
    );

    return { get, post, put, del, isLoading, error };
}