import express from 'express';
import PaymentController from '../Controllers/paymentController.js';
import { auth, isAdmin } from '../Middleware/authMiddleware.js';

const router = express.Router();

router.get('/', auth, isAdmin, PaymentController.getAll);
router.get('/:id', auth, isAdmin, PaymentController.getById);
router.get('/stats', auth, isAdmin, PaymentController.getStats);

export default router;