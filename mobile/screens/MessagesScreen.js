import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserConversations } from "../api/api";

export default function MessagesScreen({ navigation }) {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadConversations = async () => {
            try {
                const userId = await AsyncStorage.getItem("currentUserId");
                const response = await getUserConversations(userId);
                setConversations(response.data);
            } catch (error) {
                console.log("Error loading conversations", error);
            } finally {
                setLoading(false);
            }
        };

        const unsubscribe = navigation.addListener("focus", loadConversations);
        return unsubscribe;
    }, [navigation]);

    const openChat = (item) => {
        navigation.navigate("Chat", {
            otherUserId: item.otherUserId,
            otherUserName: `${item.firstName} ${item.lastName}`,
        });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.conversation}
            onPress={() => openChat(item)}
        >
            <View>
                <Text style={styles.name}>
                    {item.firstName} {item.lastName}
                </Text>
                <Text style={styles.lastMessage} numberOfLines={1}>
                    {item.lastMessage}
                </Text>
            </View>

            <Text style={styles.time}>
                {item.timestamp
                    ? new Date(item.timestamp).toLocaleDateString()
                    : ""}
            </Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={conversations}
                keyExtractor={(item) => item.otherUserId}
                renderItem={renderItem}
                ListEmptyComponent={
                    <Text style={styles.empty}>
                        Nu există conversatii
                    </Text>
                }
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    conversation: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 15,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
    },
    lastMessage: {
        color: "#666",
        marginTop: 4,
        maxWidth: 220,
    },
    time: {
        fontSize: 12,
        color: "#999",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    empty: {
        textAlign: "center",
        marginTop: 30,
        color: "#666",
    },
});
