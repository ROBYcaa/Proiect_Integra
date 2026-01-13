import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
import TabNavigator from './navigation/TabNavigator';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useEffect } from 'react';


import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

enableScreens();

const Stack = createNativeStackNavigator();
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default function App() {
    useEffect(() => {
        (async () => {
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                });
            }

            await Notifications.requestPermissionsAsync();
        })();
    }, []);
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Register"
                        component={RegisterScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Main"
                        component={TabNavigator}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}
