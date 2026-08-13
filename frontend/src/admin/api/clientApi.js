
import API from "./api";

// ==========================================
// GET ALL CLIENTS
// ==========================================

export const getClients = () =>
    API.get("/api/clients");


// ==========================================
// GET CLIENT BY ID
// ==========================================

export const getClientById = (id) =>
    API.get(`/api/clients/${id}`);


// ==========================================
// GET CLIENT AVATAR
// ==========================================

export const getClientAvatar = (id) =>
    API.get(
        `/api/clients/${id}/avatar`,
        {
            responseType: "blob"
        }
    );


// ==========================================
// UPDATE CLIENT STATUS
// ==========================================

export const updateClientStatus = (id, data) =>
    API.put(
        `/api/clients/${id}/status`,
        data
    );


// ==========================================
// UPDATE CLIENT
// Supports avatar upload
// ==========================================

export const updateClient = (id, data) =>
    API.put(
        `/api/clients/${id}`,
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

