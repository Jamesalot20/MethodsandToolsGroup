const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'An error occurred while fetching products.' });
  }
};

// Function to handle command line interface for getting products
async function getProductsCLI(rl, mainMenu) {
  rl.question('Enter a search keyword (leave empty for no keyword): ', async (search) => {
    rl.question('Enter a category (leave empty for no category): ', async (category) => {
      try {
        let query = {};

        if (search) {
          query.name = { $regex: search, $options: 'i' };
        }

        if (category) {
          query.category = category;
        }

        const products = await Product.find(query);

        if (products.length === 0) {
          console.log('No products found.');
        } else {
          console.log('Products:');
          products.forEach((product) => {
            console.log(`- ${product.name} (Category: ${product.category})`);
          });
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      // Call your mainMenu function here to return to the main menu
      mainMenu();
    });
  });
}

exports.getProductsCLI = getProductsCLI;
