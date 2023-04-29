const readline = require('readline');
const dotenv = require('dotenv');
const connectToDB = require('./db');
const { registerUser, loginUser, logoutUser, deleteUser, getCurrentUser } = require('./controllers/usersController');
const { getProductsCLI } = require('./controllers/productsController');
const { getCartByUser, addItemToCart, removeCartItem, checkout } = require('./controllers/cartsController');
const ordersController = require('./controllers/ordersController'); // Added import for ordersController
const shippingsController = require('./controllers/shippingsController'); // Added import for shippingsController
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
        editShippingInfo();
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
async function editShippingInfo() {
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
  console.log('3. Go back');

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
    if (!shippingAddresses.length) {
      console.log('No shipping addresses available to edit.');
      secondMenu();
      break;
    }

    console.log('Select the shipping address to edit:');
    shippingAddresses.forEach((address, index) => {
      console.log(`${index + 1}. ${address.fullName}, ${address.addressLine1}, ${address.city}, ${address.state}, ${address.postalCode}, ${address.country}`);
    });

    rl.question('Enter the number of the shipping address you want to edit: ', async (selectedIndex) => {
      const selectedAddress = shippingAddresses[selectedIndex - 1];

      if (!selectedAddress) {
        console.log('Invalid selection.');
        secondMenu();
        return;
      }

      console.log('\nEnter new values (leave blank to keep current value):');
      rl.question(`Full name (${selectedAddress.fullName}): `, async (fullName) => {
        rl.question(`Address line 1 (${selectedAddress.addressLine1}): `, async (addressLine1) => {
          rl.question(`City (${selectedAddress.city}): `, async (city) => {
            rl.question(`State (${selectedAddress.state}): `, async (state) => {
              rl.question(`Postal code (${selectedAddress.postalCode}): `, async (postalCode) => {
                rl.question(`Country (${selectedAddress.country}): `, async (country) => {
                  const updatedShippingData = {
                    fullName: fullName || selectedAddress.fullName,
                    addressLine1: addressLine1 || selectedAddress.addressLine1,
                    city: city || selectedAddress.city,
                    state: state || selectedAddress.state,
                    postalCode: postalCode || selectedAddress.postalCode,
                    country: country || selectedAddress.country,
                  };

                  // Call the updateShipping function
                  const updatedShipping = await shippingsController.updateShipping(selectedAddress._id, updatedShippingData);
                  if (updatedShipping) {
                    console.log('Shipping address updated successfully.');
                    console.log(updatedShipping);
                  } else {
                    console.log('Error updating shipping address.');
                  }

                  secondMenu();
                });
              });
            });
          });
        });
      });
    });
    break;
      case '3':
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
