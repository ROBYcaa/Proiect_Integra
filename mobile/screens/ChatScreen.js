import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connectWebSocket, sendMessageWS } from "../api/websocket";

export default function ChatScreen() {
    const otherUserId = "doctor1";

    const [currentUserId, setCurrentUserId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {
        const init = async () => {
            const userId = await AsyncStorage.getItem("currentUserId");
            setCurrentUserId(userId);

            connectWebSocket((message) => {
                setMessages((prev) => [...prev, message]);
            });
        };

        init();
    }, []);

    const handleSend = () => {
        if (!text.trim() || !currentUserId) return;

        const message = {
            senderId: currentUserId,
            receiverId: otherUserId,
            text: text,
        };

        sendMessageWS(message);
        setText("");
    };

    const renderItem = ({ item }) => {
        const isMine = item.senderId === currentUserId;

        return (
            <View
                style={[
                    styles.message,
                    isMine ? styles.myMessage : styles.otherMessage,
                ]}
            >
                <Text style={styles.messageText}>{item.text}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderItem}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={text}
                    onChangeText={setText}
                    placeholder="Scrie mesaj..."
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Text style={styles.sendText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    message: {
        maxWidth: "70%",
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
    },
    myMessage: {
        alignSelf: "flex-end",
        backgroundColor: "#cce5ff",
    },
    otherMessage: {
        alignSelf: "flex-start",
        backgroundColor: "#e5e5e5",
    },
    messageText: {
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderTopWidth: 1,
        padding: 5,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 5,
        padding: 8,
        marginRight: 5,
    },
    sendButton: {
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 5,
    },
    sendText: {
        color: "#fff",
    },
});