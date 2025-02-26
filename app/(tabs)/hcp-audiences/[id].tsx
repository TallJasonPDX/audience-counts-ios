// app/(tabs)/hcp-audiences/[id].tsx
import { useState, useEffect } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import useAudiences from "../../hooks/useAudiences";
import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";
import Button from "../../components/Button";
import LoadingIndicator from "../../components/LoadingIndicator";
import ErrorMessage from "../../components/ErrorMessage";
import Colors from "../../constants/Colors";
import useColorScheme from "../../hooks/useColorScheme";

export default function HCPAudienceDetailScreen() {
    const colorScheme = useColorScheme() || "light";
    const colors = Colors[colorScheme];
    const { id } = useLocalSearchParams();
    const { audiences, isLoading, error, refreshAudiences, deleteAudience } =
        useAudiences("hcp");
    const [audience, setAudience] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const handleArchive = async () => {
        try {
            setIsDeleting(true);
            Alert.alert(
                "Archive Audience",
                "Are you sure you want to archive this audience?",
                [
                    {
                        text: "Cancel",
                        style: "cancel",
                        onPress: () => setIsDeleting(false),
                    },
                    {
                        text: "Archive",
                        style: "destructive",
                        onPress: async () => {
                            await deleteAudience(Number(id));
                            router.replace("/hcp-audiences");
                        },
                    },
                ],
            );
        } catch (error) {
            console.error("Failed to archive audience:", error);
            Alert.alert(
                "Error",
                "Failed to archive the audience. Please try again later.",
            );
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return <LoadingIndicator />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    if (!audience) {
        return (
            <ThemedView style={styles.container}>
                <ThemedText type="subtitle">Audience not found.</ThemedText>
                <Button
                    title="Go Back"
                    onPress={() => router.back()}
                    variant="secondary"
                    style={styles.button}
                />
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">{audience.name}</ThemedText>

            <View style={styles.section}>
                <ThemedText type="subtitle">Description</ThemedText>
                <ThemedText>
                    {audience.description || "No description provided"}
                </ThemedText>
            </View>

            {audience.filters && (
                <View style={styles.section}>
                    <ThemedText type="subtitle">Filters</ThemedText>

                    {audience.filters.specialties &&
                        audience.filters.specialties.length > 0 && (
                            <View style={styles.filterItem}>
                                <ThemedText type="defaultSemiBold">
                                    Specialties:
                                </ThemedText>
                                <ThemedText>
                                    {audience.filters.specialties.join(", ")}
                                </ThemedText>
                            </View>
                        )}

                    {audience.filters.states &&
                        audience.filters.states.length > 0 && (
                            <View style={styles.filterItem}>
                                <ThemedText type="defaultSemiBold">
                                    States:
                                </ThemedText>
                                <ThemedText>
                                    {audience.filters.states.join(", ")}
                                </ThemedText>
                            </View>
                        )}

                    {audience.filters.geo_logic && (
                        <View style={styles.filterItem}>
                            <ThemedText type="defaultSemiBold">
                                Geographic Logic:
                            </ThemedText>
                            <ThemedText>
                                {audience.filters.geo_logic}
                            </ThemedText>
                        </View>
                    )}
                </View>
            )}

            <View style={styles.buttonContainer}>
                <Button
                    title="Edit Audience"
                    onPress={() =>
                        router.push(`/hcp-audiences/edit/${audience.id}`)
                    }
                    style={styles.button}
                />

                <Button
                    title="Archive Audience"
                    onPress={handleArchive}
                    variant="danger"
                    isLoading={isDeleting}
                    style={styles.button}
                />
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginTop: 20,
        marginBottom: 10,
    },
    filterItem: {
        marginVertical: 5,
    },
    buttonContainer: {
        marginTop: 30,
    },
    button: {
        marginVertical: 8,
    },
});
