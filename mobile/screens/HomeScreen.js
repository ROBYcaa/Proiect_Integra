import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
    const [userEmail, setUserEmail] = useState('');

    const loadUser = async () => {
        try {
            const userData = await AsyncStorage.getItem('currentUser');
            if (userData !== null) {
                const user = JSON.parse(userData);
                setUserEmail(user.email);
                console.log('User email:', user.email);
            }
        } catch (error) {
            console.log('Error loading user:', error);
        }
    };

    useEffect(() => {
        loadUser();
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
