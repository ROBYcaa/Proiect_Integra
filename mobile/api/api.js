import axios from 'axios';

const API = 'http://192.168.100.117:8080';

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
    return apiClient.get(`/api/treatment/${treatmentId}/progress`);
};

export default apiClient;