const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');

router.get('/', PaymentController.getAll);
router.get('/client/:clientId', PaymentController.getByClient);
router.get('/:id', PaymentController.getById);
router.post('/', PaymentController.create);
router.patch('/:id/status', PaymentController.updateStatus);
router.delete('/:id', PaymentController.delete);

module.exports = router;