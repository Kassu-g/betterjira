import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';  // Import routes
import boardRoutes from './routes/boardRoutes';  // Import board routes
import connectDB from './config/db';  // MongoDB connection setup

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);  
app.use('/api/board', boardRoutes);  //routes here

connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
