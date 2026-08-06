import express from 'express';
import AdsController from '../Controllers/adsController.js';
import AdLimitController from '../Controllers/adLimitController.js';
import { auth, isAdmin, isSuperAdmin } from '../Middleware/authMiddleware.js';

const router = express.Router();

router.get('/', auth, isAdmin, AdsController.getAllAds);
router.get('/pending', auth, isAdmin, AdsController.getPendingAds);
router.get('/:id', auth, isAdmin, AdsController.getAdById);
router.patch('/:id/approve', auth, isAdmin, AdsController.approveAd);
router.patch('/:id/reject', auth, isAdmin, AdsController.rejectAd);
router.delete('/:id', auth, isSuperAdmin, AdsController.deleteAd);

// Ad Limit
router.get('/limit/:client_id', auth, isAdmin, AdLimitController.checkAdLimit);
router.patch('/limit/:client_id/increment', auth, isAdmin, AdLimitController.incrementAdCount);

export default router;