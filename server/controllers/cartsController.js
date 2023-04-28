const Cart = require('../models/Cart');
const { getCurrentUser } = require('./usersController');

async function getCartByUser(rl, mainMenu) {
  try {
    let cart = await Cart.findOne({ user: getCurrentUser()._id }).populate('items.product');

    if (!cart) {
      cart = new Cart({ user: getCurrentUser()._id, items: [] });
    }

    console.log('Cart items:');
    cart.items.forEach((item) => {
      console.log(`- ${item.product.name} (Quantity: ${item.quantity})`);
    });
  } catch (error) {
    console.error('Server error.', error);
  }

  mainMenu();
}

async function addItemToCart(currentUser, rl, mainMenu) { // <-- Changed this line
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
        mainMenu();
      });
    });
  } catch (error) {
    console.error('Server error.', error);
    mainMenu();
  }
}

async function removeCartItem(rl, mainMenu) {
  try {
    rl.question('Enter the product ID: ', async (productId) => {
      const cart = await Cart.findOne({ user: getCurrentUser()._id });

      if (!cart) {
        console.log('Cart not found.');
        mainMenu();
        return;
      }

      cart.items = cart.items.filter((item) => item.product.toString() !== productId);

      await cart.save();
      console.log('Item removed from cart.');
      mainMenu();
    });
  } catch (error) {
    console.error('Server error.', error);
    mainMenu();
  }
}

module.exports = {
  getCartByUser,
  addItemToCart,
  removeCartItem,
};
