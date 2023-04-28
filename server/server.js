const readline = require('readline');
const dotenv = require('dotenv');
const connectToDB = require('./db');
const { registerUser, loginUser, logoutUser, deleteUser } = require('./controllers/usersController');
//const usersController = require('./controllers/usersController');

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
  console.log('5. Quit');

  rl.question('\nEnter your choice: ', (choice) => {
    switch (choice) {
      case '1':
        registerUser(rl);
        break;
      case '2':
        loginUser(rl);
        break;
      case '3':
        logoutUser();
        break;
      case '4':
        deleteUser();
        break;
      case '5':
        quit();
        break;
      default:
        console.log('Invalid choice. Please try again.\n');
        mainMenu();
        askForChoice();
    }
  });
}
askForChoice();
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
