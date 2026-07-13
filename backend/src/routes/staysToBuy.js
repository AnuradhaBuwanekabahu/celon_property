const express = require('express');
const router = express.Router();
const StaysToBuyController = require('../controllers/StaysToBuyController');

router.get('/', StaysToBuyController.getAll);
router.get('/search', StaysToBuyController.search);
router.get('/client/:clientId', StaysToBuyController.getByClient);
router.get('/:id', StaysToBuyController.getById);
router.post('/', StaysToBuyController.create);
router.put('/:id', StaysToBuyController.update);
router.patch('/:id/status', StaysToBuyController.updateStatus);
router.delete('/:id', StaysToBuyController.delete);

module.exports = router;