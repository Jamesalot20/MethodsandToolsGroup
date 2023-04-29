const Cart = require('../models/Cart');
const { getCurrentUser } = require('./usersController');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { createOrder } = require('./ordersController');

async function getCartByUser(currentUser, rl, callback) {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      console.log('Please log in to view your cart.');
      callback();
      return;
    }

    let cart = await Cart.findOne({ user: currentUser._id }).populate('items.product');

    if (!cart) {
      cart = new Cart({ user: currentUser._id, items: [] });
    }

    console.log('Cart items:');
    cart.items.forEach((item) => {
      console.log(`- ${item.product.name} (Quantity: ${item.quantity})`);
    });
  } catch (error) {
    console.error('Server error.', error);
  }

  callback();
}

async function addItemToCart(currentUser, rl, callback) { // <-- Changed this line
  try {
    rl.question('Enter the product ID: ', async (productId) => {
      rl.question('Enter the quantity: ', async (quantity) => {
        let cart = await Cart.findOne({ user: currentUser._id });

        if (!cart) {
          cart = new Cart({ user: currentUser._id, items: [] });
        }

        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

        if (itemIndex >= 0) {
          cart.items[itemIndex].quantity += parseInt(quantity);
        } else {
          cart.items.push({ product: productId, quantity: parseInt(quantity) });
        }

        await cart.save();
        console.log('Product added to cart successfully.');
        callback();
      });
    });
  } catch (error) {
    console.error('Server error.', error);
    callback();
  }
}

async function removeCartItem(rl, callback) {
  try {
    rl.question('Enter the product ID: ', async (productId) => {
      const cart = await Cart.findOne({ user: getCurrentUser()._id });

      if (!cart) {
        console.log('Cart not found.');
        callback();
        return;
      }

      cart.items = cart.items.filter((item) => item.product.toString() !== productId);

      await cart.save();
      console.log('Item removed from cart.');
      callback();
    });
  } catch (error) {
    console.error('Server error.', error);
    callback();
  }
}

async function checkout(rl, callback) {
  try {
    const user = getCurrentUser();
    const cart = await Cart.findOne({ user: user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      console.log('Your cart is empty.');
      callback();
      return;
    }

    // Update the stock of the products
    let totalPrice = 0;
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      product.stock -= item.quantity;

      if (product.stock < 0) {
        console.log(`Insufficient stock for ${product.name}. Only ${product.stock + item.quantity} left.`);
        callback();
        return;
      }

      await product.save();
      totalPrice += item.quantity * item.product.price;
    }

    // Create order
    const order = new Order({
      buyer: user._id,
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalPrice: totalPrice,
    });

    const req = { body: order };
    const res = {
      status: (code) => ({ json: (data) => console.log('Order created:', data) }),
    };
    await createOrder(req, res);

    // Clear the cart
    cart.items = [];
    await cart.save();

    console.log('Checkout successful.');

  } catch (error) {
    console.error('Server error.', error);
  }

  callback();
}


module.exports = {
  getCartByUser,
  addItemToCart,
  removeCartItem,
  checkout
}
