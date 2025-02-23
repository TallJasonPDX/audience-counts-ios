// app/(tabs)/hcp-audiences/[id].tsx
import { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import useAudiences from "../../hooks/useAudiences";
import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";

export default function HCPAudienceDetailScreen() {
    const { id } = useLocalSearchParams();
    const { audiences, isLoading, error, refreshAudiences, deleteAudience } =
        useAudiences("hcp"); // Use 'hcp'
    const [audience, setAudience] = useState<any>(null); // Use 'any' or a more specific type

    useEffect(() => {
        // Find the audience with the matching ID
        const foundAudience = audiences.find(
            (a: any) => a.id.toString() === id,
        );
        setAudience(foundAudience);
    }, [audiences, id]);

    useEffect(() => {
        // Initial fetch when the component mounts or audiences change
        refreshAudiences();
    }, [refreshAudiences]);

    if (isLoading) {
        return <Text>Loading audience details...</Text>;
    }

    if (error) {
        return <Text>Error: {error}</Text>;
    }

    if (!audience) {
        return <Text>Audience not found.</Text>;
    }

    const handleArchive = async () => {
        try {
            await deleteAudience(Number(id)); // Assuming deleteAudience archives it
            router.replace("/hcp-audiences"); // Go back to the list
        } catch (error) {
            console.error("Failed to archive audience:", error);
            // Handle error (e.g., show error message)
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">{audience.name}</ThemedText>
            <Text>Description: {audience.description}</Text>
            {/* Display other audience details here */}
            <Button
                title="Archive Audience"
                onPress={handleArchive}
                color="red"
            />
        </ThemedView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    linkText: {
        color: "blue",
        fontWeight: "bold",
    },
});
