import API from "./api";

export const getDashboard = () =>
    API.get("/api/dashboard");