import API from "./api";

export const getWanted = () =>
    API.get("/api/wanted");

export const getWantedById = (id) =>
    API.get(`/api/wanted/${id}`);

export const updateWanted = (id, data) =>
    API.put(`/api/wanted/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });