import API from "./api";

export const loginAdmins = (data) =>
    API.post("/api/admins/login", data);

export const registerAdmin = (data) =>
    API.post("/api/admins/register", data);


export const getAdminProfile = () =>
    API.get("/api/admins/profile");

export const updateAdminProfile = (data) =>
    API.put("/api/admins/profile", data);