import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SettingsScreen from '../screens/SettingsScreen';
import EditUserInfoScreen from '../screens/EditUserInfoScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';

const Stack = createNativeStackNavigator();

export default function SettingsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="SettingsMain"
                component={SettingsScreen}
                options={{ title: 'Settings' }}
            />
            <Stack.Screen
                name="EditUserInfo"
                component={EditUserInfoScreen}
                options={{ title: 'Edit user info' }}
            />
            <Stack.Screen
                name="ChangePassword"
                component={ChangePasswordScreen}
                options={{ title: 'Change password' }}
            />
        </Stack.Navigator>
    );
}
