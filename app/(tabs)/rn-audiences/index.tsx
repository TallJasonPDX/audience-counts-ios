// app/(tabs)/rn-audiences/index.tsx
import { View, Text, FlatList, Button, StyleSheet } from "react-native";
import useAudiences from "../../hooks/useAudiences"; // Use the new hook
import { Link, router } from "expo-router";
import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";
import { useEffect } from "react";

export default function RNAudiencesScreen() {
    const { audiences, isLoading, error, refreshAudiences } =
        useAudiences("rn");

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
            <ThemedText type="title">RN Audiences</ThemedText>
            <Button
                title="New RN Audience"
                onPress={() => router.push("/rn-audiences/create")}
            />
            <FlatList
                data={audiences}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Link href={`/rn-audiences/${item.id}`}>
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
