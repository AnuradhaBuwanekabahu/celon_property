import express from 'express';
import DashboardController from '../Controllers/dashboardController.js';
import { auth, isAdmin } from '../Middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', auth, isAdmin, DashboardController.getStats);

export default router;