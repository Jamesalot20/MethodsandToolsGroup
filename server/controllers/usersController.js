const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createShipping, getShippingByUser, updateShipping, deleteShipping } = require('./shippingsController');

async function registerUser(rl, callback) {
  rl.question('Enter your email: ', async (email) => {
    rl.question('Enter your password: ', async (password) => {
      try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
          console.log('User with this email already exists.');
          callback();
          return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
          email,
          password: hashedPassword,
          role: 'buyer', // Set default role to 'buyer'
        });

        await newUser.save();
        console.log('User successfully registered.');
      } catch (error) {
        console.error("Error in registerUser:", error);
      }
      callback();
    });
  });
}

async function loginUser(rl, callback, mainMenu, secondMenu) {
  rl.question('Enter your email: ', async (email) => {
    rl.question('Enter your password: ', async (password) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          console.log('User not found.');
          callback(mainMenu, null);
          return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          console.log('Invalid password.');
          callback(mainMenu, null);
          return;
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '400h' });

        console.log('Login successful.');
        currentUser = { _id: user._id, email: user.email, role: user.role }; // Store the user's information
        callback(null, secondMenu);
      } catch (error) {
        console.error('Server error.', error);
        callback(mainMenu, null);
      }
    });
  });
} 


// ... Keep other functions like logoutUser and deleteUser as is, but modify them to work with the command-line interface




async function logoutUser() {
  // Since JWT tokens are stateless, you cannot invalidate the token on the server-side.
  // To "log out" a user, simply remove the token from the client-side (e.g., delete it from local storage).
  currentUser = null;
  console.log('Logout successful.');
}

async function deleteUser(rl, mainMenu) {
  if (!currentUser) {
    console.log('You must be logged in to delete your account.');
    mainMenu();
    return;
  }

  rl.question('Are you sure you want to delete your account? (yes/no): ', async (answer) => {
    if (answer.toLowerCase() === 'yes') {
      try {
        const user = await User.findOneAndDelete({ email: currentUser.email });

        if (!user) {
          console.log('User not found.');
          mainMenu();
          return;
        }

        console.log('User account deleted successfully.');
        currentUser = null;
      } catch (error) {
        console.error('Server error.', error);
      }
    } else {
      console.log('Account deletion cancelled.');
    }
    mainMenu();
  });
}
async function editShippingInfo(rl, callback) {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      console.log('Please log in to edit your shipping information.');
      callback();
      return;
    }

    // Get the user's shipping information
    const shippingInfo = await getShippingByUser(currentUser);

    if (!shippingInfo) {
      console.log('No shipping information found. Please add a new shipping address.');
    } else {
      console.log(`Current shipping address: ${shippingInfo.addressLine1}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.postalCode}, ${shippingInfo.country}`);
    }

    rl.question('Enter your new street address: ', async (street) => {
      rl.question('Enter your new city: ', async (city) => {
        rl.question('Enter your new state: ', async (state) => {
          rl.question('Enter your new zip code: ', async (zipCode) => {
            rl.question('Enter your new country: ', async (country) => {

              if (shippingInfo) {
                // Update the shipping information
                const updatedShippingInfo = await updateShipping(currentUser, shippingInfo._id, { street, city, state, zipCode, country });
                console.log('Shipping information updated successfully.');
              } else {
                // Create a new shipping address
                const newShippingInfo = await createShipping(currentUser, { street, city, state, zipCode, country });
                console.log('Shipping address added successfully.');
              }

              callback();
            });
          });
        });
      });
    });
  } catch (error) {
    console.error('Server error.', error);
    callback();
  }
}
function getCurrentUser() {
  return currentUser;
}



exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.logoutUser = logoutUser;
exports.deleteUser = deleteUser;
exports.getCurrentUser = getCurrentUser;
