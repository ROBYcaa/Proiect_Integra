import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MessagesScreen from "../screens/MessagesScreen";
import ChatScreen from "../screens/ChatScreen";

const Stack = createNativeStackNavigator();

export default function MessagesStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Messages"
                component={MessagesScreen}
                options={{ title: "Mesaje" }}
            />
            <Stack.Screen
                name="Chat"
                component={ChatScreen}
                options={{ title: "Chat" }}
            />
        </Stack.Navigator>
    );
}
