import express from 'express';
import ClientController from '../Controllers/clientController.js';
import { auth, isAdmin, isSuperAdmin } from '../Middleware/authMiddleware.js';

const router = express.Router();

router.get('/', auth, isAdmin, ClientController.getAllClients);
router.get('/:id', auth, isAdmin, ClientController.getClientById);
router.patch('/:id/toggle', auth, isAdmin, ClientController.toggleClientStatus);
router.delete('/:id', auth, isSuperAdmin, ClientController.deleteClient);

export default router;