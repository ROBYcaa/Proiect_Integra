import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { login } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);
    const [message, setMessage] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setMessage('All fields are required');
            return;
        }

        try {
            await login({ email, password });
            setMessage('Login reusit');

            try {
                await AsyncStorage.setItem('currentUser', JSON.stringify({ email }));
                console.log('User saved!');
            } catch (error) {
                console.log('Error saving user:', error);
            }

            navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
            });
        } catch (error) {
            setMessage('Eroare la login');
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />

            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Parola"
                    secureTextEntry={isPasswordHidden}
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setIsPasswordHidden(!isPasswordHidden)}>
                    <Ionicons
                        name={isPasswordHidden ? 'eye-off' : 'eye'}
                        size={20}
                        color="gray"
                    />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text>Register</Text>
            </TouchableOpacity>

            {message !== '' && <Text>{message}</Text>}
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
        marginBottom: 20,
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 10,
    },
    loginButton: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 5,
        marginBottom: 15,
    },
    loginText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    registerText: {
        textAlign: 'center',
        color: '#007bff',
    },
});
