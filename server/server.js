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

function cartMenu() {
  console.log('\nPlease Choose an Option')
  console.log('1. Go Back');
  console.log('2. View Cart');
  console.log('3. Remove Item from Cart');
  console.log('4. Add Items to Cart');

  rl.question('\nEnter Your Choice: ', (choice) => {
    switch(choice) {
      case '1':
        secondMenu();
        break;
      case '2':
        getCartByUser(getCurrentUser(), rl, cartMenu);
        break;
      case '3':
        removeCartItem(rl, cartMenu);
        break;
      case '4':
        addItemToCart(getCurrentUser(), rl, cartMenu);
        break;
    }
  })
}

function secondMenu() {
  console.log('\nPlease Choose an Option')
  console.log('1. View All Items');
  console.log('2. Cart Information');
  console.log('3. Checkout');
  console.log('4. Add an Order');
  console.log('5. View Order History');
  console.log('6. Edit Account');
  console.log('7. Delete Account');
  console.log('8. Logout');

  rl.question('\nEnter Your Choice: ', (choice) => {
    switch(choice) {
      case '1':
        getProductsCLI(rl, secondMenu());
        break;
      case '2':
        cartMenu();
        break;
      case '3':
        break;
      case '4':
        break;
      case '5':
        break;
      case '6':
        break;
      case '7':
        deleteUser();
        break;
      case '8':
        logoutUser();
        mainMenu();
        break;
    }
  });
}

function mainMenu() {
  console.log('\nWelcome to TechTonic');
  console.log('Please choose an option:');
  console.log('1. Login');
  console.log('2. Create an Account');
  console.log('3. Exit Program');

  rl.question('\nEnter your choice: ', (choice) => {
    switch (choice) {
      case '1':
        loginUser(rl, secondMenu);
        break;
      case '2':
        registerUser(rl, secondMenu);
        break;
      case '3':
        quit();
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
