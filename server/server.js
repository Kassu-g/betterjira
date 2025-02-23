const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Import DB connection setup
const authRoutes = require('./routes/authRoutes'); // Import the auth routes

dotenv.config(); // Load environment variables from .env file

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // To parse JSON data
app.use(cors()); // Enable CORS

// MongoDB Connection
connectDB(); // Connect to MongoDB

// Routes
app.use('/api', authRoutes); // Use the authentication routes

// Default route (test if server is running)
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
