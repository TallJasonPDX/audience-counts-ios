// hooks/useApi.ts
import { useState, useCallback, useRef } from "react";
import { API_BASE_URL } from "../constants/api";

export default function useApi() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const pendingRequests = useRef(new Map());

    const makeRequest = useCallback(
        async (
            method: "GET" | "POST" | "PUT" | "DELETE",
            url: string,
            data?: any,
            token?: string,
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
                    if (token) {
                        headers["Authorization"] = `Bearer ${token}`;
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

                    // Make the actual API call
                    const response = await fetch(fullUrl, {
                        method,
                        headers,
                        body,
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(
                            errorData.detail ||
                                `API Error: ${response.statusText}`,
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
