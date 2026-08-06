import express from 'express';
import AdminController from '../Controllers/adminController.js';
import { auth, isAdmin } from '../Middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', AdminController.login);
router.get('/profile', auth, isAdmin, AdminController.getProfile);

export default router;