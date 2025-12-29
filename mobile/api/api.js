import axios from 'axios';

const API = 'http://10.3.0.179:8080';

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
    return axios.get(`/api/patient/treatments/${patientId}`);
};


export default apiClient;
