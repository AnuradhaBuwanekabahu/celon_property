import express from 'express';
import authMiddleware from '../Middleware/authMiddleware.js';
import {
  createWanted,
  deleteWanted,
  getWanted,
  updateWanted,
  updateWantedStatus
} from '../Controllers/wantedController.js';

const wantedRouter = express.Router();

wantedRouter.get('/', authMiddleware, getWanted);
wantedRouter.get('/status/:status', authMiddleware, getWanted);
wantedRouter.get('/search', authMiddleware, getWanted);
wantedRouter.post('/', authMiddleware, createWanted);
wantedRouter.put('/:id', authMiddleware, updateWanted);
wantedRouter.patch('/:id/status', authMiddleware, updateWantedStatus);
wantedRouter.delete('/:id', authMiddleware, deleteWanted);

export default wantedRouter;
