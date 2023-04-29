const readline = require('readline');
const dotenv = require('dotenv');
const connectToDB = require('./db');
const { registerUser, loginUser, logoutUser, deleteUser, getCurrentUser } = require('./controllers/usersController');
const { getProductsCLI } = require('./controllers/productsController');
const { getCartByUser, addItemToCart, removeCartItem } = require('./controllers/cartsController');

// Load environment variables
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function mainMenu() {
  console.log('\nWelcome to TechTonic');
  console.log('Please choose an option:');
  console.log('1. Register');
  console.log('2. Login');
  console.log('3. Logout');
  console.log('4. Delete account');
  console.log('5. View products');
  console.log('6. View cart');
  console.log('7. Add item to cart');
  console.log('8. Remove item from cart');
  console.log('9. Quit');
  console.log('10. Checkout');
  rl.question('\nEnter your choice: ', (choice) => {
    switch (choice) {
      case '1':
        registerUser(rl, mainMenu);
        break;
      case '2':
        loginUser(rl, mainMenu);
        break;
      case '3':
        logoutUser();
        break;
      case '4':
        deleteUser();
        break;
      case '5':
        getProductsCLI(rl, mainMenu);
        break;
      case '6':
        getCartByUser(getCurrentUser(), rl, mainMenu); // Remove getCurrentUser() from here
        break;
      case '7':
        addItemToCart(getCurrentUser(), rl, mainMenu); // Remove getCurrentUser() from here
        break;
      case '8':
        removeCartItem(getCurrentUser(), rl, mainMenu); // Remove getCurrentUser() from here
        break;
      case '9':
        quit();
        break;
      case '10':
        checkout(rl, mainMenu);
        break;
      default:
        console.log('Invalid choice. Please try again.\n');
        mainMenu();
    }
  });
}
exports.mainMenu = mainMenu;

function quit() {
  console.log('Goodbye!');
  rl.close();
}

connectToDB()
  .then(() => {
    console.log(`Connected to the database`);
    mainMenu();
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
  });
