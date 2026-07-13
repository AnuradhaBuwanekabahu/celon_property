const express = require('express');
const router = express.Router();
const LandController = require('../controllers/LandController');

router.get('/', LandController.getAll);
router.get('/search', LandController.search);
router.get('/client/:clientId', LandController.getByClient);
router.get('/:id', LandController.getById);
router.post('/', LandController.create);
router.put('/:id', LandController.update);
router.patch('/:id/status', LandController.updateStatus);
router.delete('/:id', LandController.delete);

module.exports = router;