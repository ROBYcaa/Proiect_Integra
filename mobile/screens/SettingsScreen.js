import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen({ navigation }) {
    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('currentUserId');
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            console.error('Logout failed:', error);
            Alert.alert('Error', 'Logout failed.');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.blueButton}
                onPress={() => navigation.navigate('EditUserInfo')}
            >
                <Text style={styles.buttonText}>Edit Info</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.blueButton}
                onPress={() => navigation.navigate('ChangePassword')}
            >
                <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>

            {/* NEW LOGOUT BUTTON */}
            <TouchableOpacity
                style={styles.redButton}
                onPress={handleLogout}
            >
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    blueButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        alignItems: 'center',
    },
    redButton: {
        backgroundColor: '#FF3B30',
        padding: 15,
        borderRadius: 8,
        marginTop: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
