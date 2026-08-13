
import API from "./api";

// ======================================================
// GET ALL STAY TO BUY
// ======================================================

export const getStayToBuy = () =>
    API.get("/api/stays-to-buy");


// ======================================================
// GET SINGLE STAY TO BUY
// ======================================================

export const getStayToBuyById = (id) =>
    API.get(`/api/stays-to-buy/${id}`);


// ======================================================
// GET MAIN IMAGE
// ======================================================

export const getStayToBuyImage = (id) =>
    API.get(
        `/api/stays-to-buy/image/${id}`
    );


// ======================================================
// GET MAIN VIDEO
// ======================================================

export const getStayToBuyVideo = (id) =>
    API.get(
        `/api/stays-to-buy/video/${id}`
    );


// ======================================================
// GET GALLERY
// ======================================================

export const getStayToBuyGallery = (id) =>
    API.get(
        `/api/stays-to-buy/gallery/${id}`
    );


// ======================================================
// GET SINGLE GALLERY IMAGE
// ======================================================

export const getStayToBuyGalleryImage = (id) =>
    API.get(
        `/api/stays-to-buy/gallery-image/${id}`
    );


// ======================================================
// UPDATE STAY TO BUY
// ======================================================

export const updateStayToBuy = (id, data) =>
    API.put(
        `/api/stays-to-buy/${id}`,
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );



