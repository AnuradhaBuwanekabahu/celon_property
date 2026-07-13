const express = require('express');
const router = express.Router();
const WantedController = require('../controllers/WantedController');

router.get('/', WantedController.getAll);
router.get('/search', WantedController.search);
router.get('/client/:clientId', WantedController.getByClient);
router.get('/:id', WantedController.getById);
router.post('/', WantedController.create);
router.put('/:id', WantedController.update);
router.patch('/:id/status', WantedController.updateStatus);
router.delete('/:id', WantedController.delete);

module.exports = router;