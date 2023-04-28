const express = require('express');
const router = express.Router();
const shippingsController = require('../controllers/shippingsController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware.authenticate, shippingsController.createShipping);
router.get('/', authMiddleware.authenticate, shippingsController.getShippingByUser);
router.put('/:shippingId', authMiddleware.authenticate, shippingsController.updateShipping);
router.delete('/:shippingId', authMiddleware.authenticate, shippingsController.deleteShipping);

module.exports = router;
