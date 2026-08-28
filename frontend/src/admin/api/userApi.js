import API from "./api";

export const getUserCount = () =>
    API.get("/api/users/count");

// Get all users
export const getUsers = () =>
    API.get("/api/users");

// Get one user
export const getUserById = (id) =>
    API.get(`/api/users/${id}`);

// Update user
export const updateUser = (id, data) =>
    API.put(`/api/users/${id}`, data);