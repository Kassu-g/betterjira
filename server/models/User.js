const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// USer schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Hash the password before saving the user
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);  // Password hashing
  next();
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); //Token with my secret from env file
  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
