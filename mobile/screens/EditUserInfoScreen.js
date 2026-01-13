import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUserInfo, updateUserInfo } from '../api/api';

export default function EditUserInfoScreen({ navigation }) {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        sex: '',
        height: '',
        weight: '',
    });

    const loadUserInfo = async () => {
        try {
            const userId = await AsyncStorage.getItem('currentUserId');
            if (!userId) return;

            const response = await getCurrentUserInfo(userId);
            const data = response.data;

            setForm({
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                sex: data.sex || '',
                height: String(data.height || ''),
                weight: String(data.weight || ''),
            });
        } catch (error) {
            console.log('Error loading user info:', error);
        }
    };

    useEffect(() => {
        loadUserInfo();
    }, []);

    const handleSave = async () => {
        try {
            const userId = await AsyncStorage.getItem('currentUserId');
            if (!userId) return;

            await updateUserInfo(userId, {
                ...form,
                height: Number(form.height),
                weight: Number(form.weight),
            });

            navigation.goBack();
        } catch (error) {
            console.log('Error saving user info:', error);
        }
    };

    const updateField = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit User Info</Text>

            <TextInput
                style={styles.input}
                placeholder="First name"
                value={form.firstName}
                onChangeText={(v) => updateField('firstName', v)}
            />

            <TextInput
                style={styles.input}
                placeholder="Last name"
                value={form.lastName}
                onChangeText={(v) => updateField('lastName', v)}
            />

            <TextInput
                style={styles.input}
                placeholder="Sex"
                value={form.sex}
                onChangeText={(v) => updateField('sex', v)}
            />

            <TextInput
                style={styles.input}
                placeholder="Height"
                keyboardType="numeric"
                value={form.height}
                onChangeText={(v) => updateField('height', v)}
            />

            <TextInput
                style={styles.input}
                placeholder="Weight"
                keyboardType="numeric"
                value={form.weight}
                onChangeText={(v) => updateField('weight', v)}
            />

            <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Save Changes</Text>
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
});