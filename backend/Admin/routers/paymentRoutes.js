import express from "express";
import {createPayment , getAllPayments, getPayment ,getRecentPayments,getRecentProperties,payhereNotify, updatePayment } from "../Controllers/paymentCOntroller.js"

const paymentrouter = express.Router();

paymentrouter.post("/create-payment", createPayment);
paymentrouter.get("/:id", getPayment);
paymentrouter.post("/notify", payhereNotify);
paymentrouter.get("/", getAllPayments);
paymentrouter.get("/recent", getRecentPayments);
paymentrouter.get("/recent-properties", getRecentProperties);
paymentrouter.put("/:id", updatePayment);

export default paymentrouter;
