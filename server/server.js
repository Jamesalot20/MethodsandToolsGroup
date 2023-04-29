const readline = require('readline');
const dotenv = require('dotenv');
const connectToDB = require('./db');
const { registerUser, loginUser, logoutUser, deleteUser, getCurrentUser } = require('./controllers/usersController');
const { getProductsCLI } = require('./controllers/productsController');
const { getCartByUser, addItemToCart, removeCartItem, checkout } = require('./controllers/cartsController');
const ordersController = require('./controllers/ordersController'); // Added import for ordersController
const shippingsController = require('./controllers/shippingsController'); // Added import for shippingsController
const paymentsController = require('./controllers/paymentsController');
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
  console.log('4. View Order History');
  console.log('5. Edit Account');
  console.log('6. Delete Account');
  console.log('7. Logout');

  rl.question('\nEnter Your Choice: ', async (choice) => {
    switch(choice) {
      case '1':
        getProductsCLI(rl, secondMenu);
        break;
      case '2':
        cartMenu();
        break;
      case '3':
        checkout(rl, secondMenu);
        break;
      case '4':
        await ordersController.getOrdersByUser({ user: { userId: getCurrentUser() } }, { // Mocked req object
         status: (code) => ({ json: (data) => console.log(data) }), // Mocked res object
          });
        secondMenu();
        break;
      case '5':
        editAccountOptions();
        break;
      case '6':
        deleteUser();
        break;
      case '7':
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
        loginUser(rl, (err, menu) => {
          if (err) {
            console.error(err);
            mainMenu();
          } else {
            menu();
          }
        }, mainMenu, secondMenu);
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
async function editAccountOptions() {
  const currentUser = getCurrentUser();
  const shippingAddresses = await shippingsController.getShippingByUser(currentUser);

  if (!shippingAddresses) {
    console.log("No shipping addresses found for this user.");
  } else {
    console.log("Current shipping address(es):");
    console.log(shippingAddresses);
  }

  console.log('\nChoose an option:');
  console.log('1. Create a new shipping address');
  console.log('2. Edit an existing shipping address');
  console.log('3. Create new payment information');
  console.log('4. Go back');

  rl.question('\nEnter your choice: ', async (choice) => {
    switch (choice) {
      case '1':
  // Get user input for the new shipping address
  rl.question('Enter full name: ', async (fullName) => {
    rl.question('Enter address line 1: ', async (addressLine1) => {
      rl.question('Enter city: ', async (city) => {
        rl.question('Enter state: ', async (state) => {
          rl.question('Enter postal code: ', async (postalCode) => {
            rl.question('Enter country: ', async (country) => {
              const shippingData = {
                fullName,
                addressLine1,
                city,
                state,
                postalCode,
                country,
              };

              // Call the createShipping function
              const newShipping = await shippingsController.createShipping(currentUser, shippingData);
              if (newShipping) {
                console.log('Shipping address created successfully.');
                console.log(newShipping);
              } else {
                console.log('Error creating shipping address.');
              }

              secondMenu();
            });
          });
        });
      });
    });
  });
  break;
      case '2':
        // Choose the shipping address to edit
        // Add a loop to handle user input and validation
        // Then, edit the chosen shipping address
        // You can reuse the code from the previous example to edit the shipping address
        break;
      case '3':
        rl.question('Enter cardholder name: ', async (cardholderName) => {
          rl.question('Enter card number: ', async (cardNumber) => {
            rl.question('Enter expiration date (MM/YY): ', async (expirationDate) => {
              rl.question('Enter CVV: ', async (cvv) => {
                const paymentData = {
                  user: getCurrentUser(),
                  cardholderName,
                  cardNumber,
                  expirationDate,
                  cvv,
                };

                const newPayment = await paymentsController.createPayment(paymentData);
                if (newPayment) {
                  console.log('Payment information created successfully.');
                } else {
                  console.log('Error creating payment information.');
                }

                editAccountOptions();
              });
            });
          });
        });
        break;
      case '4':
      default:
        secondMenu();
    }
  });
}
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
