const mongoose = require('mongoose');
const uri = "mongodb+srv://James:xxixQtTzY70iUVtP@ttdatabase.khylsrk.mongodb.net/TechTonic";

async function connect() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

module.exports = connect;
