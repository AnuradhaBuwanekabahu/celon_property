import API from "./api";

export const getPayments = () => API.get("/api/payment");

export const getPaymentById = (id) =>
    API.get(`/api/payment/${id}`);

export const getRecentPayments = () =>
    API.get("/api/payment/recent");

export const updatePayment = (id, data) =>
    API.put(`/api/payment/${id}`, data);