const Cart = require('../models/Cart');
const { getCurrentUser } = require('./usersController');

<<<<<<< HEAD
async function getCartByUser(currentUser, rl, callback) {
=======
async function getCartByUser(currentUser, rl, mainMenu) {
>>>>>>> 835ad95f42c6d604e99c7b224a467abed7645f4f
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      console.log('Please log in to view your cart.');
<<<<<<< HEAD
      callback();
=======
      mainMenu();
>>>>>>> 835ad95f42c6d604e99c7b224a467abed7645f4f
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

<<<<<<< HEAD
async function addItemToCart(currentUser, rl, callback) { // <-- Changed this line
=======
async function addItemToCart(currentUser, rl, mainMenu) { // <-- Changed this line
>>>>>>> 835ad95f42c6d604e99c7b224a467abed7645f4f
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
async function checkout(rl, mainMenu) {
  try {
    const cart = await Cart.findOne({ user: getCurrentUser()._id }).populate('items.product');

<<<<<<< HEAD
async function checkout(rl, callback) {
  try {
    const cart = await Cart.findOne({ user: getCurrentUser()._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      console.log('Your cart is empty.');
      callback();
=======
    if (!cart || cart.items.length === 0) {
      console.log('Your cart is empty.');
      mainMenu();
>>>>>>> 835ad95f42c6d604e99c7b224a467abed7645f4f
      return;
    }

    // Update the stock of the products
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      product.stock -= item.quantity;

      if (product.stock < 0) {
        console.log(`Insufficient stock for ${product.name}. Only ${product.stock + item.quantity} left.`);
<<<<<<< HEAD
        callback();
=======
        mainMenu();
>>>>>>> 835ad95f42c6d604e99c7b224a467abed7645f4f
        return;
      }

      await product.save();
    }

    // Clear the cart
    cart.items = [];
    await cart.save();

    console.log('Checkout successful.');
  } catch (error) {
    console.error('Server error.', error);
  }

<<<<<<< HEAD
  callback();
}

=======
  mainMenu();
}
>>>>>>> 835ad95f42c6d604e99c7b224a467abed7645f4f
module.exports = {
  getCartByUser,
  addItemToCart,
  removeCartItem,
  checkout
};
