import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { register } from '../api/api';


export default function RegisterScreen() {
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);
    const [message, setMessage] = useState('');

    const [form, setForm] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        sex: '',
        height: '',
        weight: '',
        dateOfBirth: '',
    });

    const updateForm = (key, value) => {
        setForm(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleRegister = async () => {
        try {
            await register({
                email: form.email,
                password: form.password,
                firstName: form.firstName,
                lastName: form.lastName,
                sex: form.sex,
                height: Number(form.height),
                weight: Number(form.weight),
                dateOfBirth: new Date(form.dateOfBirth),
            });
            setMessage('Register successful');
        } catch (e) {
            setMessage('Error');
        }
    };



    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={form.email}
                onChangeText={(value) => updateForm('email', value)}
            />

            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Password"
                    secureTextEntry={isPasswordHidden}
                    value={form.password}
                    onChangeText={(value) => updateForm('password', value)}
                />
                <TouchableOpacity onPress={() => setIsPasswordHidden(!isPasswordHidden)}>
                    <Ionicons
                        name={isPasswordHidden ? 'eye-off' : 'eye'}
                        size={20}
                        color="gray"
                    />
                </TouchableOpacity>
            </View>

            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={form.firstName}
                onChangeText={(value) => updateForm('firstName', value)}
            />

            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={form.lastName}
                onChangeText={(value) => updateForm('lastName', value)}
            />

            <View style={styles.genderRow}>
                <TouchableOpacity
                    style={[
                        styles.genderButton,
                        form.sex === 'male' && styles.genderSelected
                    ]}
                    onPress={() => updateForm('sex', 'male')}
                >
                    <Text>Male</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.genderButton,
                        form.sex === 'female' && styles.genderSelected
                    ]}
                    onPress={() => updateForm('sex', 'female')}
                >
                    <Text>Female</Text>
                </TouchableOpacity>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Date of Birth (YYYY-MM-DD)"
                value={form.dateOfBirth}
                onChangeText={(value) => updateForm('dateOfBirth', value)}
            />


            <TextInput
                style={styles.input}
                placeholder="Height (cm)"
                value={form.height}
                onChangeText={(value) => updateForm('height', value)}
                keyboardType="numeric"
            />

            <TextInput
                style={styles.input}
                placeholder="Weight (kg)"
                value={form.weight}
                onChangeText={(value) => updateForm('weight', value)}
                keyboardType="numeric"
            />

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>
            {message !== '' && (
                <Text style={{ textAlign: 'center', marginTop: 10 }}>
                    {message}
                </Text>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 10,
    },
    genderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    genderButton: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center',
        marginHorizontal: 5,
        borderRadius: 5,
    },
    genderSelected: {
        backgroundColor: '#ddd',
    },
    registerButton: {
        backgroundColor: '#28a745',
        padding: 12,
        borderRadius: 5,
        marginTop: 10,
    },
    registerText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
