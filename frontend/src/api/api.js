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
export const postTreatment = async (postTreatmentBody) => {
    try {
        const response = await axiosInstance.post("/treatments/addTreatment", postTreatmentBody);
        return response.data;
    } catch (error) {
        console.error("Error posting treatment:", error);
        throw error; // re-throw so the caller can handle it
    }
};

export const getTreatments = async (doctorId, page , size, search, filter) => {
    const response = await axiosInstance.get(`/treatments/doctor/${doctorId}?page=${page ?? ""}&size=${size ?? ""}&search=${search ?? ""}&filter=${filter ?? ""}`);
    return response.data;
};


export const updateTreatment = async (id, updatedTreatment) => {
    const response = await axiosInstance.put(`/treatments/${id}`, updatedTreatment);
    return response.data;
};

export const deleteTreatment = async (id) => {
    await axiosInstance.delete(`/treatments/${id}`);
};

export const createExport = async (exportBody) => {
    try {
        const response = await axiosInstance.post(
            "/treatments/export",
            exportBody,
            {
                responseType: "arraybuffer",
            }
        );

        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(pdfBlob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "prescriptions.pdf";
        document.body.appendChild(link);
        link.click();
        link.remove();

    } catch (error) {
        console.error("Export PDF error:", error);
        throw error;
    }
};
export const getChatHistory = async (userId1, userId2) => {
    const { data } = await axiosInstance.get(
        `/messages/history?userId1=${userId1}&userId2=${userId2}`
    );
    return data;
};
