import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { getPatientTreatmentsByDate } from '../api/api';

export default function HomeScreen() {
    const [userEmail, setUserEmail] = useState('');

    const loadUser = async () => {
        try {
            const userData = await AsyncStorage.getItem('currentUser');
            if (userData) {
                const user = JSON.parse(userData);
                setUserEmail(user.email);
            }
        } catch (error) {
            console.log('Error loading user:', error);
        }
    };

    const scheduleTreatmentNotifications = async () => {
        try {
            const userId = await AsyncStorage.getItem('currentUserId');
            if (!userId) return;

            const today = new Date().toISOString().split('T')[0];
            const response = await getPatientTreatmentsByDate(userId, today);
            const treatments = response.data;

            const startHour = 8;
            const endHour = 22;

            treatments.forEach(treatment => {
                const times = treatment.timesPerDay;
                if (times <= 0) return;

                const interval = (endHour - startHour) / (times - 1 || 1);

                for (let i = 0; i < times; i++) {
                    const notificationTime = new Date();
                    notificationTime.setHours(startHour + i * interval, 0, 0, 0);

                    Notifications.scheduleNotificationAsync({
                        content: {
                            title: `💊 ${treatment.medicationName}`,
                            body: `Time to take your dose (${i + 1}/${times})`,
                        },
                        trigger: notificationTime,
                    });
                }
            });
        } catch (error) {
            console.log('Error scheduling notifications:', error);
        }
    };

    useEffect(() => {
        loadUser();
        scheduleTreatmentNotifications();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home</Text>
            <Text style={styles.subtitle}>
                Bine ati venit{userEmail ? `, ${userEmail}` : ''}!
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
    title: { fontSize: 28, fontWeight: 'bold' },
    subtitle: { fontSize: 16, marginTop: 10, color: '#666' },
});
