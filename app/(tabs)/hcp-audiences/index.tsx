// app/(tabs)/hcp-audiences/index.tsx
// Very similar to rn-audiences/index.tsx, but uses useAudiences('hcp')
// and navigates to /hcp-audiences/create and /hcp-audiences/[id]
import { View, Text, FlatList, Button, StyleSheet } from "react-native";
import { useAudiences } from "../../hooks/useAudiences"; // Use the new hook
import { Link, router } from "expo-router";
import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";
import { useEffect } from "react";

export default function HCPAudiencesScreen() {
    const { audiences, isLoading, error, refreshAudiences } =
        useAudiences("hcp"); // 'rn' or 'hcp'

    useEffect(() => {
        refreshAudiences();
    }, [refreshAudiences]);

    if (isLoading) {
        return <Text>Loading audiences...</Text>;
    }

    if (error) {
        return <Text>Error: {error}</Text>;
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">HCP Audiences</ThemedText>
            <Button
                title="New HCP Audience"
                onPress={() => router.push("/hcp-audiences/create")}
            />
            <FlatList
                data={audiences}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Link href={`/hcp-audiences/${item.id}`}>
                            <Text style={styles.linkText}>{item.name}</Text>
                        </Link>
                        <Text>{item.description}</Text>
                    </View>
                )}
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
