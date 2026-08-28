import express from "express";
import {createPayment , getAllPayments, getPayment ,getRecentPayments,getRecentProperties,payhereNotify, updatePayment } from "../Controllers/paymentCOntroller.js"

const  adminPaymentRouter= express.Router();

adminPaymentRouter.post("/create-payment", createPayment);
adminPaymentRouter.get("/:id", getPayment);
adminPaymentRouter.post("/notify", payhereNotify);
adminPaymentRouter.get("/", getAllPayments);
adminPaymentRouter.get("/recent", getRecentPayments);
adminPaymentRouter.get("/recent-properties", getRecentProperties);
adminPaymentRouter.put("/:id", updatePayment);

export default adminPaymentRouter;
