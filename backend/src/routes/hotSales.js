const express = require('express');
const router = express.Router();
const HotSalesController = require('../controllers/HotSalesController');

// Get all properties
router.get('/', HotSalesController.getAll);

// Search properties
router.get('/search', HotSalesController.search);

// Get properties by client
router.get('/client/:clientId', HotSalesController.getByClient);

// Get property by ID
router.get('/:id', HotSalesController.getById);

// Create new property
router.post('/', HotSalesController.create);

// Update property
router.put('/:id', HotSalesController.update);

// Update property status
router.patch('/:id/status', HotSalesController.updateStatus);

// Delete property
router.delete('/:id', HotSalesController.delete);

module.exports = router;