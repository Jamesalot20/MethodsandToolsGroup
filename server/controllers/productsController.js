const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'An error occurred while fetching products.' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ error: 'Product not found.' });
    } else {
      res.status(200).json(product);
    }
  } catch (error) {
    console.error('Error fetching the product:', error);
    res.status(500).json({ error: 'An error occurred while fetching the product.' });
  }
};

exports.createProduct = async (req, res) => {
  const user = req.user;
  if (user.role !== 'seller' && user.role !== 'admin') {
    res.status(403).json({ message: 'You do not have permission to create a product' });
    return;
  }
  try {
    const product = new Product({
      ...req.body,
      seller: user.userId, // Add this line to set the seller field from the user object
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error while creating the product:', error);
    res.status(500).json({ error: 'An error occurred while creating the product.' });
  }
};
exports.createProductsBulk = async (req, res) => {
  try {
    const products = req.body;

    for (let i = 0; i < products.length; i++) {
      const product = new Product(products[i]);
      await product.save();
    }

    res.status(200).json({ message: 'Products created successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      res.status(404).json({ error: 'Product not found.' });
    } else {
      res.status(200).json(product);
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the product.' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndRemove(req.params.productId); // Update this line
    if (!product) {
      console.error('Product not found:', req.params.productId); // Update this line
      res.status(404).json({ error: 'Product not found.' });
    } else {
      res.status(200).json({ message: 'Product successfully deleted.' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'An error occurred while deleting the product.' });
  }
};

