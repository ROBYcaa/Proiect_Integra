import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Modal,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Swipeable } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import { markTreatmentIntake, getPatientTreatmentsByDate } from '../api/api';

export default function CalendarScreen() {
    const [selectedDate, setSelectedDate] = useState('');
    const [treatments, setTreatments] = useState([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [selectedTreatment, setSelectedTreatment] = useState(null);

    const dailyProgress = useMemo(() => {
        if (!selectedDate || treatments.length === 0) {
            return { percentage: 0, color: '#d9534f' };
        }

        let totalExpectedToday = 0;
        let totalTakenToday = 0;

        const selectedDateObj = new Date(selectedDate);
        selectedDateObj.setHours(0, 0, 0, 0);

        treatments.forEach((treatment) => {
            totalExpectedToday += treatment.timesPerDay;

            const intakesToday = (treatment.treatmentIntakes || []).filter((intake) => {
                const intakeDate = new Date(intake.date);
                intakeDate.setHours(0, 0, 0, 0);
                return intakeDate.getTime() === selectedDateObj.getTime();
            });

            totalTakenToday += intakesToday.length;
        });

        const percentage = totalExpectedToday > 0
            ? (totalTakenToday / totalExpectedToday) * 100
            : 0;

        let color = '#d9534f';
        if (percentage >= 80) {
            color = '#5cb85c';
        } else if (percentage >= 40) {
            color = '#f0ad4e';
        }

        return { percentage: Math.round(percentage), color };
    }, [selectedDate, treatments]);

    const onDayPress = async (day) => {
        setSelectedDate(day.dateString);

        try {
            const userId = await AsyncStorage.getItem('currentUserId');
            if (userId) {
                const response = await getPatientTreatmentsByDate(
                    userId,
                    day.dateString
                );
                setTreatments(response.data);
            }
        } catch (error) {
            console.log('Error loading treatments:', error);
        }
    };

    const openModal = (item) => {
        setSelectedTreatment(item);
        setSelectedTime(new Date());
        setModalVisible(true);
    };

    const handleConfirmDose = async () => {
        if (!selectedTreatment) return;

        const selectedDateObj = new Date(selectedDate);
        selectedDateObj.setHours(0,0,0,0);

        const intakesToday = (selectedTreatment.treatmentIntakes || []).filter(intake => {
            const intakeDate = new Date(intake.date);
            intakeDate.setHours(0,0,0,0);
            return intakeDate.getTime() === selectedDateObj.getTime();
        });

        if (intakesToday.length >= selectedTreatment.timesPerDay) {
            alert("Ati luat deja toate dozele pentru astazi!");
            setModalVisible(false);
            return;
        }

        try {
            const userId = await AsyncStorage.getItem('currentUserId');
            if (!userId) return;

            const intakeData = {
                treatmentId: selectedTreatment.id,
                patientId: userId,
                date: selectedTime,
                doseIndex: intakesToday.length,
            };

            await markTreatmentIntake(intakeData);
            setModalVisible(false);

            const response = await getPatientTreatmentsByDate(userId, selectedDate);
            setTreatments(response.data);

        } catch (error) {
            console.log('Error marking dose:', error);
        }
    };


    const renderRightActions = (item) => {
        return (
            <TouchableOpacity
                style={styles.takeDoseButton}
                onPress={() => openModal(item)}
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
                    [selectedDate]: { selected: true, selectedColor: '#007bff' },
                }}
            />

            {selectedDate && (
                <View style={styles.dailyProgressContainer}>
                    <Text style={styles.dailyProgressTitle}>
                        Daily Progress - {selectedDate}
                    </Text>
                    <View style={styles.progressSection}>
                        <View style={styles.progressBarBackground}>
                            <View
                                style={[
                                    styles.progressBarFill,
                                    {
                                        width: `${dailyProgress.percentage}%`,
                                        backgroundColor: dailyProgress.color,
                                    },
                                ]}
                            />
                        </View>
                        <Text style={styles.progressText}>
                            {dailyProgress.percentage}%
                        </Text>
                    </View>
                </View>
            )}

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
                            const selectedDateObj = new Date(selectedDate);
                            selectedDateObj.setHours(0, 0, 0, 0);

                            const intakesToday = (item.treatmentIntakes || []).filter((intake) => {
                                const intakeDate = new Date(intake.date);
                                intakeDate.setHours(0, 0, 0, 0);
                                return intakeDate.getTime() === selectedDateObj.getTime();
                            });

                            const takenToday = intakesToday.length;
                            const remaining = Math.max(item.timesPerDay - takenToday, 0);

                            return (
                                <Swipeable
                                    renderRightActions={() =>
                                        renderRightActions(item)
                                    }
                                >
                                    <View style={styles.tratamentItem}>
                                        <Text style={styles.tratamentText}>
                                            {item.medicationName}
                                        </Text>
                                        <Text>Dosage: {item.dosage}</Text>
                                        <Text>
                                            Frequency: {item.timesPerDay} / day
                                        </Text>
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
                                <Text style={styles.cancelText}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.okButton}
                                onPress={handleConfirmDose}
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
    dailyProgressContainer: {
        marginTop: 15,
        marginBottom: 10,
        padding: 15,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    dailyProgressTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
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
    progressSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressBarBackground: {
        flex: 1,
        height: 20,
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 10,
    },
    progressText: {
        marginLeft: 10,
        fontSize: 14,
        fontWeight: 'bold',
        minWidth: 45,
        textAlign: 'right',
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
        width: '80%',
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
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        padding: 10,
    },
    cancelText: {
        color: '#999',
        fontSize: 16,
    },
    okButton: {
        padding: 10,
    },
    okText: {
        color: '#4CAF50',
        fontSize: 16,
        fontWeight: 'bold',
    },
});