const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure this path is correct

// Register a new user
exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create a new user and hash the password
    const newUser = new User({ email, password });

    // Save the new user to the database
    await newUser.save();
    console.log('User saved:', newUser); // Debugging

    // Generate a JWT token for the user
    const token = newUser.generateAuthToken();

    // Send the token back as a response
    res.status(201).json({ token });
  } catch (error) {
    console.error('Error during registration:', error); // Debugging
    res.status(500).json({ message: 'Server error' });
  }
};

// Log in the user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token for the user
    const token = user.generateAuthToken();
    console.log('Generated Token for Login:', token); // Debugging

    // Send the token back as a response
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error during login:', error); // Debugging
    res.status(500).json({ message: 'Server error' });
  }
};
