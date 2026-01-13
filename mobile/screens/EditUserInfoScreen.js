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
        dateOfBirth: '',
        extraInfo: '',
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
                dateOfBirth: data.dateOfBirth ? new Date(form.dateOfBirth): '',
                extraInfo: data.extraInfo || '',

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
                dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth) : null,
                extraInfo: form.extraInfo,
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

            <View style={styles.genderRow}>
                <TouchableOpacity
                    style={[
                        styles.genderButton,
                        form.sex === 'male' && styles.genderSelected
                    ]}
                    onPress={() => updateField('sex', 'male')}
                >
                    <Text>Male</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.genderButton,
                        form.sex === 'female' && styles.genderSelected
                    ]}
                    onPress={() => updateField('sex', 'female')}
                >
                    <Text>Female</Text>
                </TouchableOpacity>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Date of Birth (YYYY-MM-DD)"
                value={form.dateOfBirth}
                onChangeText={(v) => updateField('dateOfBirth', v)}
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

            <TextInput
                style={styles.input}
                placeholder="Extra Info"
                value={form.extraInfo}
                onChangeText={(v) => updateField('extraInfo', v)}
                multiline
                numberOfLines={3}
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
    genderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    genderButton: {
        flex: 1,
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        marginHorizontal: 5,
        borderRadius: 8,
    },
    genderSelected: {
        backgroundColor: '#ddd',
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