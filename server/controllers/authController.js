const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // User model

// New user reg.
exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }// if email exists

    // Create a new user and hash the password
    const newUser = new User({ email, password });

    // Save the new user to the database
    await newUser.save();
    console.log('User saved:', newUser);

    //JWT token for the user
    const token = newUser.generateAuthToken();

    res.status(201).json({ token });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Log in
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email here
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // JWT token for the user
    const token = user.generateAuthToken();
    console.log('Generated Token for Login:', token);

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
