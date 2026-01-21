import axios from 'axios';

const API = 'http://192.168.1.129:8080';

const apiClient = axios.create({
    baseURL: API,
});

export const login = (data) => {
    return apiClient.post('/api/auth/login', data);
};

export const register = (data) => {
    return apiClient.post('/api/auth/register', data);
};

export const getPatientTreatments = (patientId) => {
    return apiClient.get(`/api/patient/treatments/${patientId}`);
};

export const getPatientTreatmentsByDate = (patientId, date) => {
    return apiClient.get(`/api/patient/treatments/${patientId}/date/${date}`);
};

export const markTreatmentIntake = (intakeData) => {
    return apiClient.post('/api/patient/treatment-intake', intakeData);
};

export const getTreatmentProgress = (treatmentId) => {
    return apiClient.get(`/api/treatments/${treatmentId}/progress`);
};

export const getCurrentUserInfo = (userId) => {
    return apiClient.get(`/api/users/${userId}/details`);
};

export const updateUserInfo = (userId, data) => {
    return apiClient.put(`/api/users/${userId}/details`, data);
};
export const changePassword = (data) => {
    return apiClient.post('/api/users/${userId}/change-password', data);
};
export const exportTreatmentsPdf = async (exportDto) => {
    return apiClient.post('api/treatments/export',
        exportDto,
        {
            responseType: "arraybuffer",
        }
    );
};
export const getChatHistory = (userId1, userId2) => {
    return apiClient.get(`/api/messages/history`, { params: { userId1, userId2 } });
};

export default apiClient;