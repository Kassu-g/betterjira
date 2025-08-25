const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes'); // Import routes
const boardRoutes = require('./routes/boardRoutes');

dotenv.config(); //environment variables from .env file

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

connectDB(); // Connect to MongoDB here

app.use('/api', authRoutes); //authentication routes
app.use('/api', boardRoutes); //use board routes

app.get('/', (req, res) => {
  res.send('Server is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
