
import API from "./api";

// ==========================================
// GET ALL CLIENTS
// ==========================================

export const getClients = () =>
    API.get("/api/admin/clients");


// ==========================================
// GET CLIENT BY ID
// ==========================================

export const getClientById = (id) =>
    API.get(`/api/admin/clients/${id}`);


// ==========================================
// GET CLIENT AVATAR
// ==========================================

export const getClientAvatar = (id) =>
    API.get(
        `/api/admin/clients/${id}/avatar`,
        {
            responseType: "blob"
        }
    );


// ==========================================
// UPDATE CLIENT STATUS
// ==========================================

export const updateClientStatus = (id, data) =>
    API.put(
        `/api/admin/clients/${id}/status`,
        data
    );


// ==========================================
// UPDATE CLIENT
// Supports avatar upload
// ==========================================

export const updateClient = (id, data) =>
    API.put(
        `/api/admin/clients/${id}`,
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

