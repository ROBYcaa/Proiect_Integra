import React, { useEffect, useState } from 'react';
import {View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import {exportTreatmentsPdf, getPatientTreatments, getTreatmentProgress} from '../api/api';
import * as Sharing from "expo-sharing";

export default function PatientTreatmentsScreen() {
    const [treatments, setTreatments] = useState([]);
    const [treatmentProgress, setTreatmentProgress] = useState({});
    const [loading, setLoading] = useState(true);

    const loadTreatments = async () => {
        try {
            const userId = await AsyncStorage.getItem('currentUserId');

            if (userId) {
                const response = await getPatientTreatments(userId);
                const treatmentsData = response.data;
                setTreatments(treatmentsData);

                const progressPromises = treatmentsData.map(async (treatment) => {
                    try {
                        const progressResponse = await getTreatmentProgress(treatment.id);
                        return {
                            id: treatment.id,
                            progress: progressResponse.data.progressPercentage
                        };
                    } catch (error) {
                        console.error(`Error loading progress for ${treatment.id}:`, error);
                        return { id: treatment.id, progress: 0 };
                    }
                });

                const progressResults = await Promise.all(progressPromises);

                const progressMap = {};
                progressResults.forEach((result) => {
                    progressMap[result.id] = result.progress;
                });

                setTreatmentProgress(progressMap);
            }
        } catch (error) {
            console.error('Error loading treatments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExportPdf = async () => {
        try {
            const patientId = await AsyncStorage.getItem("currentUserId");
            if (treatments.length === 0) return;

            const exportDto = {
                patientId,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                treatmentIds: treatments.map((t) => t.id),
            };

            const response = await exportTreatmentsPdf(exportDto);

            // Convert ArrayBuffer → Base64 (React Native)
            const base64 = btoa(
                new Uint8Array(response.data)
                    .reduce((data, byte) => data + String.fromCharCode(byte), '')
            );

            const fileUri = FileSystem.documentDirectory + "prescriptions.pdf";

            await FileSystem.writeAsStringAsync(fileUri, base64, {
                encoding: FileSystem.EncodingType.Base64,
            });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
            }

        } catch (e) {
            console.error("Export PDF failed:", e);
        }
    };

    useEffect(() => {
        loadTreatments();
    }, []);

    const getProgressColor = (percentage) => {
        if (percentage >= 80) return '#5cb85c';
        if (percentage >= 40) return '#f0ad4e';
        return '#d9534f';
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <Ionicons name="medkit-outline" size={24} color="#000" />
                <View style={styles.textContainer}>
                    <Text style={styles.medication}>{item.medicationName}</Text>
                    <Text style={styles.details}>
                        {item.dosage} - {item.timesPerDay} / day
                    </Text>
                </View>
            </View>

            <View style={styles.progressSection}>
                <View style={styles.progressBarBackground}>
                    <View
                        style={[
                            styles.progressBarFill,
                            {
                                width: `${treatmentProgress[item.id] || 0}%`,
                                backgroundColor: getProgressColor(
                                    treatmentProgress[item.id] || 0
                                ),
                            },
                        ]}
                    />
                </View>
                <Text style={styles.progressText}>
                    {Math.round(treatmentProgress[item.id] || 0)}%
                </Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Treatments</Text>

            <FlatList
                data={treatments}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No treatments found</Text>
                }
            />
            <TouchableOpacity style={styles.floatingButton}
                              onPress={handleExportPdf}/>
        </View>
    );
}

const styles = StyleSheet.create({
    floatingButton: {
        position: "absolute",
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#0066cc",
        justifyContent: "center",
        alignItems: "center",
        elevation: 8,
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    card: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    textContainer: {
        marginLeft: 10,
        flex: 1,
    },
    medication: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    details: {
        fontSize: 14,
        color: '#666',
    },
    progressSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    progressBarBackground: {
        flex: 1,
        height: 20,
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 10,
    },
    progressText: {
        marginLeft: 10,
        fontSize: 14,
        fontWeight: 'bold',
        minWidth: 45,
        textAlign: 'right',
    },
    emptyText: {
        textAlign: 'center',
        color: '#888',
        marginTop: 20,
    },
});