const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Define the user schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Hash the password before saving the user
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();  // Only hash if password is modified
  this.password = await bcrypt.hash(this.password, 10);  // Hash the password
  next();
});

// Generate JWT Token
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
