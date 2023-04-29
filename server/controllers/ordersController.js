const Order = require('../models/Order');
exports.getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user.userId; // Accessing the userId from req.user
     console.log('User ID:', userId);
    const orders = await Order.find({ buyer: userId });
    console.log('Filtered orders:', orders);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching orders.' });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'An error occurred while creating the order.' });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndRemove(req.params.id);
    if (!order) {
      res.status(404).json({ error: 'Order not found.' });
    } else {
      res.status(200).json({ message: 'Order successfully deleted.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the order.' });
  }
};
