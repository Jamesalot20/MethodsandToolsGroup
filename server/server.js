const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectToDB = require('./db');

// Import routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const shippingRoutes = require('./routes/shippingRoutes');

// Import error middleware
const errorMiddleware = require('./middlewares/errorMiddleware');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/shipping', shippingRoutes);

// Error handling middleware
app.use(errorMiddleware.errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to connect to the database:', error);
});
module.exports = app;
