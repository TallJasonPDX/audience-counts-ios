// app/(tabs)/rn-audiences/create.tsx
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
import { useAuth } from "../../hooks/useAuth";
import Colors from "../../constants/Colors";
import useColorScheme from "../../hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";

export default function CreateRNAudienceScreen() {
    const colorScheme = useColorScheme() || "light";
    const colors = Colors[colorScheme];
    const { createAudience, isLoading, error } = useAudiences("rn");
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
    const [experienceFilter, setExperienceFilter] = useState({
        min_years: 0,
        max_years: 0,
        min_months: 0,
        max_months: 0
    });
    const [formError, setFormError] = useState("");
    const { get } = useApi();
    const { token } = useAuth();

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                if (!token) {
                    throw new Error("No authentication token available");
                }
                const response = await get("/meta/specialties", token);
                
                // Check if response is an array before using map
                if (Array.isArray(response)) {
                    setSpecialties(response.map((s: any) => s.specialty));
                } else if (response && typeof response === 'object') {
                    // Handle if response is an object with data array inside
                    const specialtiesData = response.data || response.specialties || [];
                    if (Array.isArray(specialtiesData)) {
                        setSpecialties(specialtiesData.map((s: any) => s.specialty));
                    } else {
                        console.error("Unexpected specialties data format:", specialtiesData);
                    }
                } else {
                    console.error("Unexpected API response format:", response);
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
    }, [get, token]);

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
            // Create the filters object in the expected format
            const statesArray = states
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s !== "");
                
            // Only include experience filter if at least one value is non-zero
            const hasExperienceFilter = Object.values(experienceFilter).some(val => val > 0);
            
            const audienceData = {
                name,
                description,
                sql_query: null, // Add null sql_query to prevent server error
                filters: {
                    specialties: selectedSpecialties,
                    states: statesArray,
                    zip_regions: zipRegions.filter(
                        (region) => region.label.trim() && region.zip.trim(),
                    ),
                    geo_logic: geoLogic,
                    ...(hasExperienceFilter && { experience_filter: experienceFilter })
                },
            };

            await createAudience(audienceData);
            Alert.alert("Success", "Audience created successfully", [
                { text: "OK", onPress: () => router.replace("/rn-audiences") },
            ]);
        } catch (e: any) {
            Alert.alert("Error", e.message || "Failed to create audience");
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <ThemedText type="title">Create RN Audience</ThemedText>

                <View style={styles.formSection}>
                    <Input
                        label="Audience Name"
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter audience name"
                        icon="people-outline"
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
                        <View>
                            <ThemedText type="defaultSemiBold" style={styles.selectedSpecialtiesHeader}>
                                Selected: {selectedSpecialties.length > 0 
                                    ? selectedSpecialties.join(", ") 
                                    : "None"}
                            </ThemedText>
                            <Picker
                                selectedValue=""
                                onValueChange={(value) => {
                                    if (value && !selectedSpecialties.includes(value)) {
                                        setSelectedSpecialties([...selectedSpecialties, value]);
                                    }
                                }}
                                style={styles.picker}
                            >
                                <Picker.Item label="Select specialties" value="" />
                                {specialties && specialties.length > 0 ? (
                                    specialties.map((specialty, index) => (
                                        <Picker.Item
                                            key={index}
                                            label={specialty}
                                            value={specialty}
                                        />
                                    ))
                                ) : (
                                    <Picker.Item label="Loading specialties..." value="" />
                                )}
                            </Picker>
                            
                            {selectedSpecialties.length > 0 && (
                                <ScrollView 
                                    horizontal 
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.selectedSpecialtiesContainer}
                                >
                                    {selectedSpecialties.map((specialty, index) => (
                                        <View key={index} style={styles.specialtyChip}>
                                            <ThemedText>{specialty}</ThemedText>
                                            <Ionicons
                                                name="close-circle" 
                                                size={18} 
                                                color={colors.text}
                                                onPress={() => {
                                                    setSelectedSpecialties(
                                                        selectedSpecialties.filter(s => s !== specialty)
                                                    );
                                                }}
                                                style={styles.removeIcon}
                                            />
                                        </View>
                                    ))}
                                </ScrollView>
                            )}
                        </View>
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
                    <ThemedText type="subtitle">Experience Filter</ThemedText>
                    <View style={styles.experienceFilterContainer}>
                        <View style={styles.experienceFilterRow}>
                            <Input
                                label="Min Years"
                                value={String(experienceFilter.min_years)}
                                onChangeText={(text) => 
                                    setExperienceFilter({
                                        ...experienceFilter,
                                        min_years: parseInt(text) || 0
                                    })
                                }
                                placeholder="0"
                                keyboardType="number-pad"
                                icon="calendar-outline"
                                containerStyle={styles.experienceInput}
                            />
                            <Input
                                label="Max Years"
                                value={String(experienceFilter.max_years)}
                                onChangeText={(text) => 
                                    setExperienceFilter({
                                        ...experienceFilter,
                                        max_years: parseInt(text) || 0
                                    })
                                }
                                placeholder="0"
                                keyboardType="number-pad"
                                icon="calendar-outline"
                                containerStyle={styles.experienceInput}
                            />
                        </View>
                        <View style={styles.experienceFilterRow}>
                            <Input
                                label="Min Months"
                                value={String(experienceFilter.min_months)}
                                onChangeText={(text) => 
                                    setExperienceFilter({
                                        ...experienceFilter,
                                        min_months: parseInt(text) || 0
                                    })
                                }
                                placeholder="0"
                                keyboardType="number-pad"
                                icon="calendar-outline"
                                containerStyle={styles.experienceInput}
                            />
                            <Input
                                label="Max Months"
                                value={String(experienceFilter.max_months)}
                                onChangeText={(text) => 
                                    setExperienceFilter({
                                        ...experienceFilter,
                                        max_months: parseInt(text) || 0
                                    })
                                }
                                placeholder="0"
                                keyboardType="number-pad"
                                icon="calendar-outline"
                                containerStyle={styles.experienceInput}
                            />
                        </View>
                    </View>
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
    selectedSpecialtiesHeader: {
        marginTop: 8,
        marginBottom: 4,
    },
    selectedSpecialtiesContainer: {
        marginTop: 10,
        maxHeight: 50,
    },
    specialtyChip: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#e2e8f0", 
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
        marginVertical: 4,
    },
    removeIcon: {
        marginLeft: 6,
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
    experienceFilterContainer: {
        marginTop: 10,
    },
    experienceFilterRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    experienceInput: {
        flex: 1,
        marginRight: 10,
    },
});
