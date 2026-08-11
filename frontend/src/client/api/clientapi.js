import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000", // Change if your backend uses another port
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("clientToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;