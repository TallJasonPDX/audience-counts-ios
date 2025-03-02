// app/(tabs)/hcp-audiences/create.tsx
import { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";
import Button from "../../components/Button";
import Input from "../../components/Input";
import useAudiences from "../../hooks/useAudiences";
import useApi from "../../hooks/useApi";
import Colors from "../../constants/Colors";
import useColorScheme from "../../hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";

export default function CreateHCPAudienceScreen() {
    const colorScheme = useColorScheme() || "light";
    const colors = Colors[colorScheme];
    const { createAudience, isLoading, error } = useAudiences("hcp");
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
    const [formError, setFormError] = useState("");
    const { get } = useApi();

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const response = await get("/md_specialties");
                setSpecialties(response.map((s: any) => s.specialty));
            } catch (error) {
                console.error("Failed to fetch specialties:", error);
                Alert.alert(
                    "Error",
                    "Failed to load specialties. Please check your connection.",
                );
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

    const validateForm = () => {
        if (!name.trim()) {
            setFormError("Audience name is required");
            return false;
        }

        // Validate zip regions
        const invalidRegions = zipRegions.filter(
            (region) =>
                region.label.trim() && (!region.zip.trim() || !region.radius),
        );

        if (invalidRegions.length > 0) {
            setFormError("All fields in zip regions must be completed");
            return false;
        }

        setFormError("");
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const audienceData = {
                name,
                description,
                filters: {
                    specialties: selectedSpecialties,
                    states: states
                        .split(",")
                        .map((s) => s.trim())
                        .filter((s) => s !== ""),
                    zip_regions: zipRegions.filter(
                        (region) => region.label.trim() && region.zip.trim(),
                    ),
                    geo_logic: geoLogic,
                },
            };

            await createAudience(audienceData);
            Alert.alert("Success", "HCP Audience created successfully", [
                { text: "OK", onPress: () => router.replace("/hcp-audiences") },
            ]);
        } catch (e: any) {
            Alert.alert("Error", e.message || "Failed to create audience");
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <ThemedText type="title">Create HCP Audience</ThemedText>

                <View style={styles.formSection}>
                    <Input
                        label="Audience Name"
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter audience name"
                        icon="medkit-outline"
                        error={
                            formError && !name.trim() ? "Name is required" : ""
                        }
                    />

                    <Input
                        label="Description"
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Enter description"
                        multiline
                        numberOfLines={3}
                        icon="document-text-outline"
                        containerStyle={styles.textArea}
                    />
                </View>

                <View style={styles.formSection}>
                    <ThemedText type="subtitle">Specialties</ThemedText>

                    <View
                        style={[
                            styles.pickerContainer,
                            {
                                borderColor: colors.border,
                                backgroundColor: colors.inputBg,
                            },
                        ]}
                    >
                        <Picker
                            selectedValue={selectedSpecialties}
                            onValueChange={(value) =>
                                setSelectedSpecialties(
                                    Array.isArray(value) ? value : [value],
                                )
                            }
                            style={styles.picker}
                        >
                            <Picker.Item label="Select specialties" value="" />
                            {specialties.map((specialty) => (
                                <Picker.Item
                                    key={specialty}
                                    label={specialty}
                                    value={specialty}
                                />
                            ))}
                        </Picker>
                    </View>
                </View>

                <View style={styles.formSection}>
                    <Input
                        label="States (comma-separated)"
                        value={states}
                        onChangeText={setStates}
                        placeholder="e.g., CA, NV, AZ"
                        icon="location-outline"
                    />
                </View>

                <View style={styles.formSection}>
                    <ThemedText type="subtitle">Geographic Logic</ThemedText>
                    <View style={styles.geoLogicContainer}>
                        <Button
                            title="AND"
                            onPress={() => setGeoLogic("AND")}
                            variant={
                                geoLogic === "AND" ? "primary" : "secondary"
                            }
                            size="small"
                            style={styles.geoButton}
                        />
                        <Button
                            title="OR"
                            onPress={() => setGeoLogic("OR")}
                            variant={
                                geoLogic === "OR" ? "primary" : "secondary"
                            }
                            size="small"
                            style={styles.geoButton}
                        />
                    </View>
                </View>

                <View style={styles.formSection}>
                    <View style={styles.sectionHeader}>
                        <ThemedText type="subtitle">
                            Zip Code Regions
                        </ThemedText>
                        <Button
                            title="Add Region"
                            onPress={handleAddRegion}
                            size="small"
                            variant="secondary"
                            style={styles.addButton}
                        />
                    </View>

                    {zipRegions.map((region, index) => (
                        <View key={index} style={styles.regionContainer}>
                            <View style={styles.regionHeader}>
                                <ThemedText type="defaultSemiBold">
                                    Region {index + 1}
                                </ThemedText>
                                <Button
                                    title="Remove"
                                    onPress={() => handleRemoveRegion(index)}
                                    variant="danger"
                                    size="small"
                                />
                            </View>

                            <Input
                                label="Region Label"
                                value={region.label}
                                onChangeText={(text) =>
                                    handleRegionChange(index, "label", text)
                                }
                                placeholder="e.g., Northeast"
                                icon="bookmark-outline"
                            />

                            <Input
                                label="ZIP Code"
                                value={region.zip}
                                onChangeText={(text) =>
                                    handleRegionChange(index, "zip", text)
                                }
                                placeholder="Enter ZIP code"
                                keyboardType="number-pad"
                                icon="mail-outline"
                            />

                            <Input
                                label="Radius (miles)"
                                value={String(region.radius)}
                                onChangeText={(text) =>
                                    handleRegionChange(index, "radius", text)
                                }
                                placeholder="Enter radius in miles"
                                keyboardType="number-pad"
                                icon="resize-outline"
                            />
                        </View>
                    ))}
                </View>

                {formError && (
                    <ThemedText style={styles.errorText}>
                        {formError}
                    </ThemedText>
                )}

                <View style={styles.buttonContainer}>
                    <Button
                        title="Create Audience"
                        onPress={handleSubmit}
                        isLoading={isLoading}
                        disabled={isLoading}
                        size="large"
                        style={styles.submitButton}
                    />
                    <Button
                        title="Cancel"
                        onPress={() => router.back()}
                        variant="secondary"
                        style={styles.cancelButton}
                    />
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    formSection: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    textArea: {
        height: 100,
    },
    pickerContainer: {
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 5,
    },
    picker: {
        height: 50,
    },
    geoLogicContainer: {
        flexDirection: "row",
        marginTop: 10,
    },
    geoButton: {
        marginRight: 10,
        minWidth: 80,
    },
    regionContainer: {
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        marginBottom: 15,
    },
    regionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    addButton: {
        minWidth: 100,
    },
    buttonContainer: {
        marginTop: 20,
        marginBottom: 40,
    },
    submitButton: {
        marginBottom: 10,
    },
    cancelButton: {
        marginBottom: 10,
    },
    errorText: {
        color: "#ef4444",
        marginBottom: 10,
    },
});
