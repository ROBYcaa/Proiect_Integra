import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { getPatientTreatments } from '../api/api';

export default function PatientTreatmentsScreen() {
    const [treatments, setTreatments] = useState([]);

    const loadTreatments = async () => {
        try {
            const userId = await AsyncStorage.getItem('currentUserId');

            if (userId) {
                const response = await getPatientTreatments(userId);
                console.log('Response:', response.data);

                setTreatments(response.data);
            }
        } catch (error) {
            console.error('Error loading treatments:', error);
        }
    };


    useEffect(() => {
        loadTreatments();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Ionicons name="medkit-outline" size={24} color="#000" />
            <View style={styles.textContainer}>
                <Text style={styles.medication}>{item.medicationName}</Text>
                <Text style={styles.details}>
                    {item.dosage} – {item.timesPerDay} / zi
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tratamentele mele</Text>

            <FlatList
                data={treatments}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            />
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
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
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
    },
    medication: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    details: {
        fontSize: 14,
        color: '#666',
    },
});
