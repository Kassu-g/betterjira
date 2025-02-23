const mongoose = require('mongoose');
require('dotenv').config(); // Load .env variables

// MongoDB connection setup
const connectDB = async () => {
  try {
    const dbUri = process.env.DB_URI; // Fetch URI from .env file
    await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });

    console.log('MongoDB Connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit if connection fails
  }
};

module.exports = connectDB;
