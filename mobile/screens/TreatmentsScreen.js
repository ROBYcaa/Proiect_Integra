import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { getPatientTreatments } from '../api/api';

export default function TreatmentsScreen() {
    const [treatments, setTreatments] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadTreatments = async () => {
        try {
            const userData = await AsyncStorage.getItem('currentUser');
            if (userData !== null) {
                const user = JSON.parse(userData);

                const response = await getPatientTreatments(user.id);
                setTreatments(response.data);
            }
        } catch (error) {
            console.log('Error loading treatments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTreatments();
    }, []);

    const renderTreatment = ({ item }) => (
        <View style={styles.card}>
            <Ionicons name="medkit-outline" size={24} color="#007AFF" />
            <View style={styles.textContainer}>
                <Text style={styles.medication}>{item.medicationName}</Text>
                <Text style={styles.details}>
                    Dozaj: {item.dosage}
                </Text>
                <Text style={styles.details}>
                    Administrări / zi: {item.timesPerDay}
                </Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <Text>Se încarcă tratamentele...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tratamentele mele</Text>

            {treatments.length === 0 ? (
                <Text style={styles.empty}>
                    Nu există tratamente.
                </Text>
            ) : (
                <FlatList
                    data={treatments}
                    keyExtractor={(item) => item.id}
                    renderItem={renderTreatment}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
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
    empty: {
        textAlign: 'center',
        marginTop: 20,
        color: '#999',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
