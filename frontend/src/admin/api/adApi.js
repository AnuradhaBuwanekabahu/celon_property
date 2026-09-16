
import API from "./api";

// Get all ads
export const getAds = () =>
    API.get("/api/ads/ads");

// Get single ad
export const getAdById = (id) =>
    API.get(`/api/ads/ads/${id}`);

// Update ad
export const updateAd = (id, data) =>
    API.put(
        `/api/ads/ads/${id}`,
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

