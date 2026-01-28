import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import SettingsStack from './SettingsStack';
import CalendarScreen from '../screens/CalendarScreen';
import PatientTreatmentsScreen from '../screens/PatientTreatmentsScreen';
import MessagesStack from './MessagesStack';

const Tab = createBottomTabNavigator();
export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Messages') {
                            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
                    } else if (route.name === 'Calendar') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    } else if (route.name === 'Tratamente') {
                        iconName = focused ? 'list' : 'list-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Tratamente" component={PatientTreatmentsScreen} />
            <Tab.Screen name="Calendar" component={CalendarScreen} />
            <Tab.Screen name="Settings" component={SettingsStack} />
            <Tab.Screen name="Messages" component={MessagesStack}/>
        </Tab.Navigator>
    );
}
