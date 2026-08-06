import express from 'express';
import HotSalesController from '../Controllers/hotsalesController.js';
import LandsController from '../Controllers/landsController.js';
import StayToBuyController from '../Controllers/staytobuyController.js';
import StayToRentController from '../Controllers/staytorentController.js';
import WantedController from '../Controllers/wantedController.js';
import { auth, isAdmin, isSuperAdmin } from '../Middleware/authMiddleware.js';

const router = express.Router();

// Hot Sales
router.patch('/hotsales/:id/approve', auth, isAdmin, HotSalesController.approve);
router.patch('/hotsales/:id/reject', auth, isAdmin, HotSalesController.reject);
router.delete('/hotsales/:id', auth, isSuperAdmin, HotSalesController.delete);

// Lands
router.patch('/lands/:id/approve', auth, isAdmin, LandsController.approve);
router.patch('/lands/:id/reject', auth, isAdmin, LandsController.reject);
router.delete('/lands/:id', auth, isSuperAdmin, LandsController.delete);

// Stays To Buy
router.patch('/stays-to-buy/:id/approve', auth, isAdmin, StayToBuyController.approve);
router.patch('/stays-to-buy/:id/reject', auth, isAdmin, StayToBuyController.reject);
router.delete('/stays-to-buy/:id', auth, isSuperAdmin, StayToBuyController.delete);

// Stays To Rent
router.patch('/stays-to-rent/:id/approve', auth, isAdmin, StayToRentController.approve);
router.patch('/stays-to-rent/:id/reject', auth, isAdmin, StayToRentController.reject);
router.delete('/stays-to-rent/:id', auth, isSuperAdmin, StayToRentController.delete);

// Wanted
router.delete('/wanted/:id', auth, isSuperAdmin, WantedController.delete);

export default router;