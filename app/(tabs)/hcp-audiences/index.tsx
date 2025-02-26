// app/(tabs)/hcp-audiences/index.tsx
import { useRef } from "react";
import { StyleSheet, FlatList, View, TouchableOpacity } from "react-native";
import useAudiences from "../../hooks/useAudiences";
import { router } from "expo-router";
import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";
import Button from "../../components/Button";
import LoadingIndicator from "../../components/LoadingIndicator";
import ErrorMessage from "../../components/ErrorMessage";
import Colors from "../../constants/Colors";
import useColorScheme from "../../hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import AudienceListItem from "../../components/AudienceListItem";

export default function HCPAudiencesScreen() {
    const colorScheme = useColorScheme() || "light";
    const colors = Colors[colorScheme];
    const { audiences, isLoading, error, refreshAudiences } =
        useAudiences("hcp");
    const manualRefreshRef = useRef(false);

    // Only manually trigger refresh when component mounts or user explicitly requests it
    const handleRefresh = () => {
        manualRefreshRef.current = true;
        refreshAudiences();
    };

    // We removed the useEffect that was causing the infinite loop

    const renderItem = ({ item }: { item: any }) => (
        <AudienceListItem audience={item} type="hcp" />
    );

    const handleCreateAudience = () => {
        router.push("/(tabs)/hcp-audiences/create");
    };

    if (isLoading && !manualRefreshRef.current) {
        return <LoadingIndicator message="Loading HCP audiences..." />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <ThemedText type="title">HCP Audiences</ThemedText>
                <Button
                    title="Create New"
                    onPress={handleCreateAudience}
                    variant="primary"
                    size="medium"
                    style={styles.createButton}
                />
            </View>

            {audiences.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons
                        name="medkit-outline"
                        size={60}
                        color={colors.subtitle}
                    />
                    <ThemedText type="subtitle" style={styles.emptyText}>
                        No HCP audiences found
                    </ThemedText>
                    <ThemedText style={styles.emptySubtext}>
                        Create your first HCP audience to get started
                    </ThemedText>
                    <Button
                        title="Create Audience"
                        onPress={handleCreateAudience}
                        style={styles.emptyButton}
                    />
                </View>
            ) : (
                <FlatList
                    data={audiences}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshing={isLoading && manualRefreshRef.current}
                    onRefresh={handleRefresh}
                />
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    createButton: {
        minWidth: 120,
    },
    listContent: {
        paddingBottom: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    emptyText: {
        marginTop: 20,
        marginBottom: 10,
        textAlign: "center",
    },
    emptySubtext: {
        textAlign: "center",
        marginBottom: 30,
    },
    emptyButton: {
        minWidth: 180,
    },
});
