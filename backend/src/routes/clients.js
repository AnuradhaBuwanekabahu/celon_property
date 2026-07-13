const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/ClientController');

// Get all clients
router.get('/', ClientController.getAll);

// Get client by ID
router.get('/:id', ClientController.getById);

// Create new client
router.post('/', ClientController.create);

// Update client
router.put('/:id', ClientController.update);

// Delete client
router.delete('/:id', ClientController.delete);

// Login
router.post('/login', ClientController.login);

module.exports = router;