import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const dbUri = process.env.DB_URI as string;  // Cast the DB URI environment variable to string

  if (!dbUri) {
    console.error('DB_URI is not defined in the environment variables');
    process.exit(1);  // Exit if the DB error
  }

  try {
    await mongoose.connect(dbUri);  // Connect to MongoDB
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);  // Exit the process if the connection fails
  }
};

export default connectDB;
