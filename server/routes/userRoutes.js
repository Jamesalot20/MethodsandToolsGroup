const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const authMiddleware = require('../middlewares/authMiddleware');
const productsController = require('../controllers/productsController');

router.post('/register', usersController.registerUser);
router.post('/login', usersController.loginUser);
router.post('/createProduct', authMiddleware.authenticate, authMiddleware.authorize(['seller', 'admin']), productsController.createProduct);
router.post('/bulk', authMiddleware.authenticate, authMiddleware.authorize(['seller', 'admin']), productsController.createProductsBulk);
router.post('/logout', authMiddleware.authenticate, usersController.logoutUser);
router.delete('/deleteUser/:email', authMiddleware.authenticate, authMiddleware.authorize(['admin']), usersController.deleteUser);
router.delete('/:productId', authMiddleware.authenticate, authMiddleware.authorize(['seller', 'admin']), productsController.deleteProduct);




router.get('/', usersController.getUsers);
router.get('/protected', authMiddleware.authenticate, authMiddleware.authorize(['admin', 'seller']), usersController.protectedRoute);
router.get('/userByEmail/:email', usersController.getUserByEmail);
module.exports = router;
