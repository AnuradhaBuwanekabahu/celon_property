const express = require('express');
const router = express.Router();
const AdController = require('../controllers/AdController');

router.get('/', AdController.getAll);
router.get('/active', AdController.getActive);
router.get('/:id', AdController.getById);
router.post('/', AdController.create);
router.put('/:id', AdController.update);
router.patch('/:id/toggle', AdController.toggleActive);
router.delete('/:id', AdController.delete);

module.exports = router;