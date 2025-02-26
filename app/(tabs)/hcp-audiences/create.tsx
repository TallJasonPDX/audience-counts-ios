// app/(tabs)/hcp-audiences/create.tsx
import { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    ScrollView,
    Alert,
} from "react-native";
import useAudiences from "../../hooks/useAudiences";
import { router } from "expo-router";
import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";
import { Picker } from "@react-native-picker/picker"; // For dropdowns
import useApi from "../../hooks/useApi"; // Import useApi

export default function CreateHCPAudienceScreen() {
    const { createAudience, isLoading, error } = useAudiences("hcp"); // Use 'hcp'
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [specialties, setSpecialties] = useState<string[]>([]);
    const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(
        [],
    );
    const [states, setStates] = useState("");
    const [zipRegions, setZipRegions] = useState([
        { label: "", zip: "", radius: 25 },
    ]);
    const [geoLogic, setGeoLogic] = useState("OR");
    const { get } = useApi();

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const response = await get("/md_specialties"); // Assuming you have this endpoint
                setSpecialties(response.map((s: any) => s.specialty)); // Adjust based on your API response
            } catch (error) {
                console.error("Failed to fetch specialties:", error);
            }
        };

        fetchSpecialties();
    }, [get]);

    const handleAddRegion = () => {
        setZipRegions([...zipRegions, { label: "", zip: "", radius: 25 }]);
    };

    const handleRemoveRegion = (index: number) => {
        setZipRegions(zipRegions.filter((_, i) => i !== index));
    };

    const handleRegionChange = (
        index: number,
        field: string,
        value: string,
    ) => {
        const newRegions = [...zipRegions];
        newRegions[index] = { ...newRegions[index], [field]: value };
        setZipRegions(newRegions);
    };

    const handleSubmit = async () => {
        const audienceData = {
            name,
            description,
            filters: {
                specialties: selectedSpecialties,
                states: states
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s !== ""),
                zip_regions: zipRegions,
                geo_logic: geoLogic,
            },
        };

        try {
            await createAudience(audienceData);
            router.replace("/hcp-audiences"); // Go back to the list
        } catch (e: any) {
            Alert.alert("Error", e.message || "Failed to create audience");
        }
    };

    if (isLoading) {
        return <Text>Creating audience...</Text>;
    }

    return (
        <ThemedView style={styles.container}>
            <ScrollView>
                <ThemedText type="title">Create HCP Audience</ThemedText>

                <Text>Audience Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                />

                <Text>Description</Text>
                <TextInput
                    style={styles.input}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />

                <Text>Specialties</Text>
                <Picker
                    selectedValue={selectedSpecialties}
                    onValueChange={(itemValue) =>
                        setSelectedSpecialties(itemValue)
                    }
                >
                    {specialties.map((specialty) => (
                        <Picker.Item
                            key={specialty}
                            label={specialty}
                            value={specialty}
                        />
                    ))}
                </Picker>

                <Text>States (comma-separated)</Text>
                <TextInput
                    style={styles.input}
                    value={states}
                    onChangeText={setStates}
                    placeholder="e.g., CA, NV, AZ"
                />

                <Text>Geographic Logic</Text>
                <View style={styles.radioContainer}>
                    <Button
                        title="AND"
                        onPress={() => setGeoLogic("AND")}
                        color={geoLogic === "AND" ? "blue" : "grey"}
                    />
                    <Button
                        title="OR"
                        onPress={() => setGeoLogic("OR")}
                        color={geoLogic === "OR" ? "blue" : "grey"}
                    />
                </View>

                <Text>Zip Code Regions</Text>
                {zipRegions.map((region, index) => (
                    <View key={index} style={styles.regionContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Region Label"
                            value={region.label}
                            onChangeText={(text) =>
                                handleRegionChange(index, "label", text)
                            }
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="ZIP Code"
                            value={region.zip}
                            onChangeText={(text) =>
                                handleRegionChange(index, "zip", text)
                            }
                            keyboardType="number-pad"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Radius (miles)"
                            value={String(region.radius)}
                            onChangeText={(text) =>
                                handleRegionChange(index, "radius", text)
                            }
                            keyboardType="number-pad"
                        />
                        <Button
                            title="Remove"
                            onPress={() => handleRemoveRegion(index)}
                            color="red"
                        />
                    </View>
                ))}
                <Button title="Add Region" onPress={handleAddRegion} />

                <Button
                    title="Create Audience"
                    onPress={handleSubmit}
                    disabled={isLoading}
                />
                {error && <Text style={{ color: "red" }}>{error}</Text>}
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    radioContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 10,
    },
    regionContainer: {
        marginBottom: 10,
        borderColor: "#eee",
        borderWidth: 1,
        padding: 10,
    },
});
