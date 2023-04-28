const readline = require('readline');
const dotenv = require('dotenv');
const connectToDB = require('./db');

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
    console.log('3. Quit');
  
    rl.question('\nEnter your choice: ', (choice) => {
      switch (choice) {
        case '1':
          registerUser();
          break;
        case '2':
          loginUser();
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

// ... Implement other functions like registerUser, loginUser, etc.

connectToDB()
  .then(() => {
    console.log(`Connected to the database`);
    mainMenu();
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
  });
