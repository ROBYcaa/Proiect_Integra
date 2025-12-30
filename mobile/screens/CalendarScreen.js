import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList,  } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Swipeable } from 'react-native-gesture-handler';
import { getPatientTreatmentsByDate } from '../api/api';
import {
    Modal,
    TouchableOpacity,
    Platform,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';


export default function CalendarScreen() {
    const [selectedDate, setSelectedDate] = useState('');
    const [treatments, setTreatments] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [selectedTreatment, setSelectedTreatment] = useState(null);


    const onDayPress = async (day) => {
        setSelectedDate(day.dateString);

        try {
            const userData = await AsyncStorage.getItem('currentUser');
            if (userData) {
                const user = JSON.parse(userData);
                const response = await getPatientTreatmentsByDate(
                    user.id,
                    day.dateString
                );
                setTreatments(response.data);
            }
        } catch (error) {
            console.log('Error loading treatments:', error);
        }
    };

    const renderRightActions = (item) => {
        return (
            <TouchableOpacity
                style={styles.takeDoseButton}
                onPress={() => {
                    setSelectedTreatment(item);
                    setSelectedTime(new Date());
                    setModalVisible(true);
                }}
            >
                <Text style={styles.takeDoseText}>Take dose</Text>
            </TouchableOpacity>
        );
    };


    return (
        <View style={styles.container}>
            <Calendar
                onDayPress={onDayPress}
                markedDates={{
                    [selectedDate]: { selected: true }
                }}
            />

            <View style={styles.tratamenteContainer}>
                <Text style={styles.title}>
                    Treatments {selectedDate ? `- ${selectedDate}` : ''}
                </Text>

                {selectedDate && treatments.length === 0 ? (
                    <Text style={styles.emptyText}>
                        There are no treatments for this day
                    </Text>
                ) : (
                    <FlatList
                        data={treatments}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => {
                            const takenToday = item.treatmentIntakes?.length || 0;
                            const remaining = Math.max(
                                item.timesPerDay - takenToday,
                                0
                            );

                            return (
                                <Swipeable
                                    renderRightActions={() => renderRightActions(item)}
                                >
                                    <View style={styles.tratamentItem}>
                                        <Text style={styles.tratamentText}>
                                            {item.medicationName}
                                        </Text>
                                        <Text>Dosage: {item.dosage}</Text>
                                        <Text>Frequency: {item.timesPerDay} / day</Text>
                                        <Text style={styles.remainingText}>
                                            Remaining today: {remaining}
                                        </Text>
                                    </View>
                                </Swipeable>
                            );
                        }}
                    />
                )}
            </View>
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>
                            Enter dose intake
                        </Text>

                        <View style={styles.pickerContainer}>
                            <DateTimePicker
                                value={selectedTime}
                                mode="time"
                                is24Hour
                                maximumDate={new Date()}
                                display="spinner"
                                textColor="black"
                                onChange={(event, date) => {
                                    if (date) setSelectedTime(date);
                                }}
                            />
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.okButton}
                                onPress={() => {
                                    console.log('Confirm dose for:', selectedTreatment);
                                    console.log('Time:', selectedTime);
                                    setModalVisible(false);
                                }}
                            >
                                <Text style={styles.okText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },

    tratamenteContainer: {
        marginTop: 20,
    },

    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    tratamentItem: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },

    tratamentText: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    remainingText: {
        marginTop: 5,
        color: '#d9534f',
        fontWeight: 'bold',
    },

    emptyText: {
        color: '#888',
        marginTop: 10,
    },

    takeDoseButton: {
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        marginVertical: 5,
        borderRadius: 8,
    },

    takeDoseText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalCard: {
        backgroundColor: '#fff',
        width: '85%',
        borderRadius: 10,
        padding: 20,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },

    pickerContainer: {
        marginVertical: 10,
    },

    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },

    cancelButton: {
        padding: 10,
    },

    cancelText: {
        color: '#999',
    },

    okButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 6,
    },

    okText: {
        color: '#fff',
        fontWeight: 'bold',
    },

});
