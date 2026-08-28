import API from "./api";



// Get All Lands
export const getLands = () =>
    API.get("/api/lands");

// Get Single Land
export const getLandById = (id) =>
    API.get(`/api/lands/${id}`);

// Update Land
export const updateLand = (id, data) =>
    API.put(`/api/lands/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

// Delete Land
export const deleteLand = (id) =>
    API.delete(`/api/lands/${id}`);