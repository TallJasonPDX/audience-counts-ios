// components/AudienceForm.tsx
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    ScrollView,
    Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useApi } from "../hooks/useApi";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

interface AudienceFormProps {
    onSubmit: (audienceData: any) => Promise<void>;
    initialData?: any; // For editing
    audienceType: "rn" | "hcp";
}

export function AudienceForm({
    onSubmit,
    initialData,
    audienceType,
}: AudienceFormProps) {
    const [name, setName] = useState(initialData?.name || "");
    const [description, setDescription] = useState(
        initialData?.description || "",
    );
    const [specialties, setSpecialties] = useState<string[]>([]);
    const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(
        initialData?.filters?.specialties || [],
    );
    const [states, setStates] = useState(
        initialData?.filters?.states
            ? initialData.filters.states.join(", ")
            : "",
    );
    const [zipRegions, setZipRegions] = useState(
        initialData?.filters?.zip_regions || [
            { label: "", zip: "", radius: 25 },
        ],
    );
    const [geoLogic, setGeoLogic] = useState(
        initialData?.filters?.geo_logic || "OR",
    );
    const [isLoading, setIsLoading] = useState(false); // Local loading state
    const [error, setError] = useState("");
    const { get } = useApi();

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const response = await get("/specialties");
                // Assuming the backend returns an array of { specialty: string, segment_code: string }
                if (audienceType === "rn") {
                    setSpecialties(response.map((s: any) => s.specialty));
                } else {
                    setSpecialties(response.map((s: any) => s.specialty));
                }
            } catch (error) {
                console.error("Failed to fetch specialties:", error);
                Alert.alert(
                    "Error",
                    "Failed to load specialties. Please check your connection.",
                );
            }
        };

        fetchSpecialties();
    }, [get, audienceType]);

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
        try {
            setIsLoading(true);
            setError("");
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
            await onSubmit(audienceData);
        } catch (e: any) {
            setError(e.message || "An unexpected error occurred.");
            Alert.alert("Error", e.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView>
                <ThemedText type="title">
                    {initialData ? "Edit" : "Create"}{" "}
                    {audienceType === "rn" ? "RN" : "HCP"} Audience
                </ThemedText>

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
                    title={initialData ? "Save Changes" : "Create Audience"}
                    onPress={handleSubmit}
                    disabled={isLoading}
                />
                {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
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
