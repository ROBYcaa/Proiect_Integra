import axios from "axios";

const API_URL = "http://localhost:8080/api";

const getToken = () => localStorage.getItem("token");

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getPatients = async () => {
    const {data} = await axiosInstance.get("/doctor/patients");
    return data;
};
    export const getPatientDetails = async (userId) => {
        const { data } = await axiosInstance.get(`/doctor/patients/${userId}/details`);
        return data;
    };
export async function addTreatment(treatment) {
    const response = await axios.post("http://localhost:8080/api/treatments", treatment);
    return response.data;
}

