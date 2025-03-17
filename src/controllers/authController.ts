import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';  // Assuming User model is in the models directory
import { Request, Response } from 'express';

// Handle login request
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    // Compare password with hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    // Generate JWT token
    const token = user.generateAuthToken();  // Assuming generateAuthToken() is defined in User model

    // Send the token back to the client
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
// New user reg.
export const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: 'Email already exists' });
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
