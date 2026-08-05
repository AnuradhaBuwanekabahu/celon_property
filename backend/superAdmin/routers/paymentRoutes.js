import express from "express";


// Database payment functions
import {
    getAllPayments,
    getPaymentById,
    updatePaymentStatus,
    paymentStats,
    deletePayment,
    createPayment
} from "../Controllers/paymentController.js";



// PayHere functions
import {
    generatePayhereHash,
    verifyPayhereSignature
} from "../services/payhereService.js";


const paymentRouter = express.Router();


// Create payment
paymentRouter.post(
    "/",
    createPayment
);


// Get all payments
paymentRouter.get(
    "/",
    getAllPayments
);


// Get payments by status
paymentRouter.get(
    "/status/:status",
    getAllPayments
);


// Get payment by id
paymentRouter.get(
    "/:id",
    getPaymentById
);


// Update payment status
paymentRouter.patch(
    "/:id/status",
    updatePaymentStatus
);

paymentRouter.put(
    "/status/:id",
    updatePaymentStatus
);


// Payment statistics
paymentRouter.get(
    "/stats",
    paymentStats
);

paymentRouter.get(
    "/admin/total-revenue",
    paymentStats
);


// Delete payment
paymentRouter.delete(
    "/:id",
    deletePayment
);



export default paymentRouter;