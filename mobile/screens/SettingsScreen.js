import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
export default function SettingsScreen() {
    const handleLogout = () => {
// logout logic
        console.log('Logout');
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
        ,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold'
        ,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#FF3B30'
        ,
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
    },
    buttonText: {
        color: '#fff'
        ,
        textAlign: 'center'
        ,
        fontWeight: 'bold'
        ,
    },
});