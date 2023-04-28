const express = require('express');
const router = express.Router();
const cartsController = require('../controllers/cartsController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware.authenticate, cartsController.getCartByUser);
router.post('/add', authMiddleware.authenticate, cartsController.addItemToCart);
router.put('/update', authMiddleware.authenticate, cartsController.updateCartItem);
router.delete('/remove/:productId', authMiddleware.authenticate, cartsController.removeCartItem);

module.exports = router;
