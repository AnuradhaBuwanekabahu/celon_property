import express from "express";


// Database payment functions
import {
    getAllPayments,
    getPaymentById,
    updatePaymentStatus,
    paymentStats,
    deletePayment
} from "../Controllers/paymentController.js";



// PayHere functions
import {
    generatePayhereHash,
    verifyPayhereSignature
} from "../services/payhereService.js";


const paymentRouter = express.Router();



// Get all payments
paymentRouter.get(
    "/",
    getAllPayments
);


// Get payment by id
paymentRouter.get(
    "/:id",
    getPaymentById
);


// Update payment status
paymentRouter.put(
    "/status/:id",
    updatePaymentStatus
);


// Payment statistics
paymentRouter.get(
    "/stats",
    paymentStats
);


// Delete payment
paymentRouter.delete(
    "/:id",
    deletePayment
);



export default paymentRouter;