import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000", // Change if your backend uses another port
});

export default API;