const express = require('express');
const router = express.Router();
const StaysToRentController = require('../controllers/StaysToRentController');

router.get('/', StaysToRentController.getAll);
router.get('/search', StaysToRentController.search);
router.get('/client/:clientId', StaysToRentController.getByClient);
router.get('/:id', StaysToRentController.getById);
router.post('/', StaysToRentController.create);
router.put('/:id', StaysToRentController.update);
router.patch('/:id/status', StaysToRentController.updateStatus);
router.delete('/:id', StaysToRentController.delete);

module.exports = router;