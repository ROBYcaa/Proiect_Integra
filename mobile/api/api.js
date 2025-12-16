import axios from 'axios';

const API = 'http://192.168.0.10:8080';

const apiClient = axios.create({
    baseURL: API,
});

export const login = (data) => {
    return apiClient.post('/auth/login', data);
};

export default apiClient;
