const mongoose = require('mongoose');

/**
 * Connect to MongoDB
 * Fail fast - if connection fails, exit process
 */
const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
      console.error('MONGO_URI is not defined in environment variables');
      process.exit(1);
    }

    await mongoose.connect(MONGO_URI);

    console.log('✅ MongoDB connected successfully');
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   Host: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }

  // Handle connection events
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB error:', err);
  });
};

module.exports = connectDB;