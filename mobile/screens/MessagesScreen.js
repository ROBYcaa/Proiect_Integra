import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserConversations, getDoctors } from "../api/api";

export default function MessagesScreen({ navigation }) {
    const [conversations, setConversations] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        loadConversations();
    }, []);

    const loadConversations = async () => {
        const userId = await AsyncStorage.getItem("currentUserId");
        const response = await getUserConversations(userId);
        setConversations(response.data);
    };

    const openDoctorsModal = async () => {
        const response = await getDoctors();
        setDoctors(response.data);
        setModalVisible(true);
    };

    const startChatWithDoctor = (doctor) => {
        setModalVisible(false);
        console.log("MessageScreen" + doctor.id)
        navigation.navigate("Chat", {
            otherUserId: doctor.id,
            otherUserName: doctor.firstName + " " + doctor.lastName
        });
    };

    const renderConversation = ({ item }) => (
        <TouchableOpacity
            style={styles.conversation}
            onPress={() =>{
                navigation.navigate("Chat", {
                    otherUserId: item.conversationUserId,
                    otherUserName: item.fullName,
                })
            }}
        >
            <Text style={styles.name}>{item.fullName}</Text>
            <Text style={styles.lastMessage}>{item.lastMessage}</Text>
        </TouchableOpacity>
    );

    const renderDoctor = ({ item }) => (
        <TouchableOpacity
            style={styles.doctorItem}
            onPress={() => startChatWithDoctor(item)}
        >
            <Text style={styles.name}>
                {item.firstName +" " + item.lastName}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={conversations}
                keyExtractor={(item, index) =>
                    item.conversationUserId ? item.conversationUserId : index.toString()
                }
                renderItem={renderConversation}
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={openDoctorsModal}
            >
                <Text style={styles.addText}>＋</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.header}>Alege un doctor</Text>

                    <FlatList
                        data={doctors}
                        keyExtractor={(item) => item.id}
                        renderItem={renderDoctor}
                    />

                    <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={styles.close}>Inchide</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    conversation: {
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
    },
    addButton: {
        position: "absolute",
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#007bff",
        justifyContent: "center",
        alignItems: "center",
    },
    addText: {
        fontSize: 30,
        color: "#fff",
    },
    modalContainer: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
    },
    doctorItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    close: {
        textAlign: "center",
        marginTop: 20,
        color: "red",
    },
});
