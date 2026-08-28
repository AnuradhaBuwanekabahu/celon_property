import API from "./api";

// =====================================
// GET ALL STAY TO RENT PROPERTIES
// =====================================

export const getStayToRent = () =>
    API.get("/api/stays-to-rent");


// =====================================
// GET SINGLE STAY TO RENT
// =====================================

export const getStayToRentById = (id) =>
    API.get(`/api/stays-to-rent/${id}`);


// =====================================
// GET GALLERY IMAGES
// =====================================

export const getStayToRentGallery = (id) =>
    API.get(`/api/stays-to-rent/gallery/${id}`);


// =====================================
// UPDATE STAY TO RENT
// =====================================

export const updateStayToRent = (id, data) =>
    API.put(
        `/api/stays-to-rent/${id}`,
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );