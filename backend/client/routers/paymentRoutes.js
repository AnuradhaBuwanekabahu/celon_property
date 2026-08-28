import express from "express";
import {createPayment , getPayment , payhereNotify, showAllPayments } from "../Controllers/paymentCOntroller.js"

const paymentrouter = express.Router();


paymentrouter.post("/create-payment" , createPayment);
paymentrouter.get("/showall" , showAllPayments);
paymentrouter.get("/:id" , getPayment);
paymentrouter.post("/notify" , payhereNotify)

export default paymentrouter;
