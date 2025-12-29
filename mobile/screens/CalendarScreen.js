import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { getPatientTreatmentsByDate } from '../api/api';

export default function CalendarScreen() {
    const [selectedDate, setSelectedDate] = useState('');
    const [treatments, setTreatments] = useState([]);

    const onDayPress = async (day) => {
        setSelectedDate(day.dateString);

        try {
            const userData = await AsyncStorage.getItem('currentUser');
            if (userData) {
                const user = JSON.parse(userData);
                const response = await getPatientTreatmentsByDate(
                    user.id,
                    day.dateString
                );
                setTreatments(response.data);
            }
        } catch (error) {
            console.log('Error loading treatments:', error);
        }
    };

    const renderTreatment = ({ item }) => (
        <View style={styles.card}>
            <Ionicons name="clipboard-outline" size={24} color="#000" />
            <View style={{ marginLeft: 10 }}>
                <Text style={styles.medication}>{item.medicationName}</Text>
                <Text style={styles.details}>
                    {item.dosage} – {item.timesPerDay} / zi
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Calendar
                onDayPress={onDayPress}
                markedDates={{
                    [selectedDate]: { selected: true }
                }}
            />

            <Text style={styles.title}>
                Tratamente pentru {selectedDate || '...'}
            </Text>

            <FlatList
                data={treatments}
                keyExtractor={(item) => item.id}
                renderItem={renderTreatment}
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
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
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
    medication: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    details: {
        fontSize: 14,
        color: '#666',
    },
});
