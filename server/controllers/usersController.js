const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


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

async function loginUser(rl, callback) {
  rl.question('Enter your email: ', async (email) => {
    rl.question('Enter your password: ', async (password) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          console.log('User not found.');
          callback();
          return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          console.log('Invalid password.');
          mainMenu();
          return;
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '400h' });

        console.log('Login successful.');
        currentUser = { _id: user._id, email: user.email, role: user.role }; // Store the user's information
      } catch (error) {
        console.error('Server error.', error);
      }
      callback();
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

function getCurrentUser() {
  return currentUser;
}



exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.logoutUser = logoutUser;
exports.deleteUser = deleteUser;
exports.getCurrentUser = getCurrentUser;
