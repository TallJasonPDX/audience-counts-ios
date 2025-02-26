// hooks/useAudiences.ts
import { useState, useCallback, useEffect, useRef } from "react";
import useApi from "./useApi";
import { useAuth } from "./useAuth";
import {
    AudienceCreate,
    MetaUserAudienceResponse,
    MetaUserHCPAudienceResponse,
} from "../api/schemas/main";

type AudienceType = "rn" | "hcp";

export default function useAudiences(type: AudienceType) {
    const { get, post, put, del } = useApi();
    const { token } = useAuth();
    const [audiences, setAudiences] = useState<
        (MetaUserAudienceResponse | MetaUserHCPAudienceResponse)[]
    >([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Use a ref to track if we've already fetched data
    const initialFetchDone = useRef(false);

    const fetchAudiences = useCallback(async () => {
        // Skip if no token yet
        if (!token) return;

        setIsLoading(true);
        setError(null);

        try {
            const endpoint =
                type === "rn" ? "/user_audiences" : "/user_hcp_audiences";
            const response = await get(`/meta${endpoint}`, token);

            if (response && response.data) {
                setAudiences(response.data);
            } else {
                setAudiences([]);
            }
        } catch (error: any) {
            console.error(`Failed to fetch ${type} audiences:`, error);
            setError(error.message || `Failed to load ${type} audiences`);
        } finally {
            setIsLoading(false);
        }
    }, [get, type, token]);

    const createAudience = useCallback(
        async (audienceData: AudienceCreate) => {
            if (!token) return null;

            setIsLoading(true);
            setError(null);

            try {
                const endpoint =
                    type === "rn" ? "/user_audiences" : "/user_hcp_audiences";
                const response = await post(
                    `/meta${endpoint}`,
                    audienceData,
                    token,
                );

                // Refresh the audiences list after creating a new one
                await fetchAudiences();

                return response;
            } catch (error: any) {
                console.error(`Failed to create ${type} audience:`, error);
                setError(error.message || `Failed to create ${type} audience`);
                throw error;
            } finally {
                setIsLoading(false);
            }
        },
        [post, fetchAudiences, type, token],
    );

    const updateAudience = useCallback(
        async (audienceId: number, audienceData: AudienceCreate) => {
            if (!token) return null;

            setIsLoading(true);
            setError(null);

            try {
                const endpoint =
                    type === "rn"
                        ? `/user_audiences/${audienceId}`
                        : `/user_hcp_audiences/${audienceId}`;
                const response = await put(
                    `/meta${endpoint}`,
                    audienceData,
                    token,
                );

                // Refresh the audiences list after updating
                await fetchAudiences();

                return response;
            } catch (error: any) {
                console.error(`Failed to update ${type} audience:`, error);
                setError(error.message || `Failed to update ${type} audience`);
                throw error;
            } finally {
                setIsLoading(false);
            }
        },
        [put, fetchAudiences, type, token],
    );

    const deleteAudience = useCallback(
        async (audienceId: number) => {
            if (!token) return;

            setIsLoading(true);
            setError(null);

            try {
                const endpoint =
                    type === "rn"
                        ? `/user_audiences/${audienceId}`
                        : `/user_hcp_audiences/${audienceId}`;
                await del(`/meta${endpoint}`, token);

                // Refresh the audiences list after deletion
                await fetchAudiences();
            } catch (error: any) {
                console.error(`Failed to delete ${type} audience:`, error);
                setError(error.message || `Failed to delete ${type} audience`);
                throw error;
            } finally {
                setIsLoading(false);
            }
        },
        [del, fetchAudiences, type, token],
    );

    const getAudienceCount = useCallback(
        async (audienceId: number) => {
            if (!token) return 0;

            setIsLoading(true);
            setError(null);

            try {
                const endpoint =
                    type === "rn"
                        ? `/user_audiences/${audienceId}/count`
                        : `/user_hcp_audiences/${audienceId}/count`;

                const response = await post(
                    `/meta${endpoint}`,
                    undefined,
                    token,
                );
                return response.count;
            } catch (error: any) {
                console.error(`Failed to get ${type} audience count:`, error);
                setError(error.message || `Failed to get audience count`);
                throw error;
            } finally {
                setIsLoading(false);
            }
        },
        [post, type, token],
    );

    // Initial fetch of audiences - only once when token is available
    useEffect(() => {
        if (token && !initialFetchDone.current) {
            initialFetchDone.current = true;
            fetchAudiences();
        }
    }, [token, fetchAudiences]);

    return {
        audiences,
        isLoading,
        error,
        refreshAudiences: fetchAudiences,
        createAudience,
        updateAudience,
        deleteAudience,
        getAudienceCount,
    };
}
