const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/ClientController');

// Public routes
router.post('/register', ClientController.register);
router.post('/login', ClientController.login);

// Protected routes (require authentication)
router.get('/profile', ClientController.getProfile);

// Admin only routes
router.get('/', ClientController.getAll);
router.get('/:id', ClientController.getById);
router.put('/:id', ClientController.update);
router.delete('/:id', ClientController.delete);

module.exports = router;