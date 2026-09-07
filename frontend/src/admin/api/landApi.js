import API from "./api";



// Get All Lands
export const getLands = () =>
    API.get("/api/admin/lands");

// Get Single Land
export const getLandById = (id) =>
    API.get(`/api/admin/lands/${id}`);

// Update Land
export const updateLand = (id, data) =>
    API.put(`/api/admin/lands/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

