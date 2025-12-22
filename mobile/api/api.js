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


export default apiClient;
