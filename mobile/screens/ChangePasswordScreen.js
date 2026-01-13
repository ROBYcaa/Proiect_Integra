import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { changePassword } from '../api/api';

export default function ChangePasswordScreen({ navigation }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            const userId = await AsyncStorage.getItem('currentUserId');
            if (!userId) return;

            await changePassword({
                userId,
                currentPassword,
                newPassword,
            });

            setMessage('Password changed successfully');
            navigation.goBack();
        } catch (error) {
            setMessage('Current password is incorrect');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Change Password</Text>

            <TextInput
                style={styles.input}
                placeholder="Current password"
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
            />

            <TextInput
                style={styles.input}
                placeholder="New password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
            />

            <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

            {message ? <Text style={styles.message}>{message}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>
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
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    message: {
        marginVertical: 10,
        color: '#d9534f',
    },
});