import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface IUser extends Document {
  email: string;
  password: string;
  generateAuthToken: () => string;
}

const userSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10); // Password hashing
  next();
});

//generate JWT token
userSchema.methods.generateAuthToken = function (): string {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET as string, {
    expiresIn: '1h',
  });
  return token;
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
