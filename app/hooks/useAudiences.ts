// hooks/useAudiences.ts
import { useState, useCallback, useEffect } from "react";
import { useApi } from "./useApi";
import {
    AudienceCreate,
    MetaUserAudienceResponse,
    MetaUserHCPAudienceResponse,
} from "@/api/schemas/main"; // Import Pydantic models

type AudienceType = "rn" | "hcp";

export default function useAudiences(type: AudienceType) {
    const { get, post, put, del, isLoading, error } = useApi();
    const [audiences, setAudiences] = useState<
        (MetaUserAudienceResponse | MetaUserHCPAudienceResponse)[]
    >([]);

    const fetchAudiences = useCallback(async () => {
        const endpoint =
            type === "rn" ? "/user_audiences" : "/user_hcp_audiences";
        try {
            const response = await get(`/meta${endpoint}`);
            setAudiences(response.data);
        } catch (error) {
            console.error("Failed to fetch audiences:", error);
            // Handle error appropriately (e.g., show error message to user)
        }
    }, [get, type]);

    const createAudience = useCallback(
        async (audienceData: AudienceCreate) => {
            const endpoint =
                type === "rn" ? "/user_audiences" : "/user_hcp_audiences";
            try {
                const response = await post(`/meta${endpoint}`, audienceData);
                // Assuming the backend returns the created audience
                return response; // Return the created audience
            } catch (error) {
                console.error("Failed to create audience:", error);
                // Handle error appropriately (e.g., show error message to user)
                throw error; // Re-throw the error so the caller can handle it
            }
        },
        [post, type],
    );

    const updateAudience = useCallback(
        async (audienceId: number, audienceData: AudienceCreate) => {
            const endpoint =
                type === "rn"
                    ? `/user_audiences/${audienceId}`
                    : `/user_hcp_audiences/${audienceId}`;
            try {
                const response = await put(endpoint, audienceData);
                // Optionally, refresh the audience list or update the local state
                return response;
            } catch (error) {
                console.error("Failed to update audience:", error);
                throw error;
            }
        },
        [put, type],
    );

    const deleteAudience = useCallback(
        async (audienceId: number) => {
            const endpoint =
                type === "rn"
                    ? `/user_audiences/${audience_id}`
                    : `/user_hcp_audiences/${audience_id}`;
            try {
                await del(endpoint);
                // Optionally, refresh the audience list or update the local state
            } catch (error) {
                console.error("Failed to delete audience:", error);
                throw error;
            }
        },
        [del, type],
    );

    const getAudienceCount = useCallback(
        async (audienceId: number) => {
            const endpoint =
                type === "rn"
                    ? `/user_audiences/${audienceId}/count`
                    : `/user_hcp_audiences/${audienceId}/count`;

            try {
                const response = await post(endpoint); // Assuming a POST request
                return response.count; // Adjust based on your API response structure
            } catch (error) {
                console.error("Failed to get audience count:", error);
                throw error;
            }
        },
        [post, type],
    );

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
