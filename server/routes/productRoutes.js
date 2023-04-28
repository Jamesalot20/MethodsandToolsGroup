const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const authMiddleware = require('../middlewares/authMiddleware');

// Get all products
router.get('/', productsController.getProducts);

// Get a single product by ID
router.get('/:productId', productsController.getProductById);

// Add a new product (assuming the user is a seller)
router.post('/createProduct', authMiddleware.authenticate, authMiddleware.authorize(['seller', 'admin']), productsController.createProduct);

// Update an existing product (assuming the user is the product owner)
router.put('/:productId', productsController.updateProduct);

// Delete a product (assuming the user is the product owner or an admin)



module.exports = router;
