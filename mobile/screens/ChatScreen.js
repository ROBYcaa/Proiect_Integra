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
import { connectWebSocket, sendMessageWS, sendReadWS} from "../api/websocket";
import { getChatHistory, markMessagesAsRead} from "../api/api";

export default function ChatScreen({ route }) {
    const { otherUserId, otherUserName } = route.params;

    const [currentUserId, setCurrentUserId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {
        const init = async () => {
            const userId = await AsyncStorage.getItem("currentUserId");
            setCurrentUserId(userId);

            try {
                const response = await getChatHistory(userId, otherUserId);
                setMessages(response.data);
            } catch (error) {
                console.log("Error loading chat history", error);
            }

            connectWebSocket(
                (message) => {
                    if (
                        (message.senderId === otherUserId &&
                            message.receiverId === userId) ||
                        (message.senderId === userId &&
                            message.receiverId === otherUserId)
                    ) {
                        setMessages(prev => [...prev, message]);
                    }
                },
                (readDto) => {
                    if (
                        readDto.senderId === currentUserId &&
                        readDto.receiverId === otherUserId
                    ) {
                        setMessages(prev =>
                            prev.map(m =>
                                m.senderId === currentUserId
                                    ? { ...m, read: true }
                                    : m
                            )
                        );
                    }
                }
            );

        };

        init();
    }, [otherUserId]);

    useEffect(() => {
        if (!currentUserId || !otherUserId) return;

        markMessagesAsRead(otherUserId, currentUserId);
        sendReadWS(otherUserId, currentUserId);
    }, [currentUserId, otherUserId]);


    const handleSend = () => {
        if (!text.trim() || !currentUserId) return;

        const message = {
            senderId: currentUserId,
            receiverId: otherUserId,
            text,
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
                {item.timestamp && (
                    <Text style={styles.timeText}>
                        {new Date(item.timestamp).toLocaleTimeString()}
                        {isMine && (item.read ? " ✔✔" : " ✔")}
                    </Text>
                )}
            </View>
        );
    };


    return (
        <View style={styles.container}>
            <Text style={styles.header}>
                Chat cu {otherUserName}
            </Text>

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
                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSend}
                >
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
    timeText: {
        fontSize: 11,
        color: "#555",
        alignSelf: "flex-end",
        marginTop: 4,
    },
    header: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },

});