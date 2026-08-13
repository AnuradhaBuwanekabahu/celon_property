
import API from "./api";

// Get all ads
export const getAds = () =>
    API.get("/api/ads");

// Get single ad
export const getAdById = (id) =>
    API.get(`/api/ads/${id}`);

// Update ad
export const updateAd = (id, data) =>
    API.put(
        `/api/ads/${id}`,
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

