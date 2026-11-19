const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * Supports local MongoDB instance or MongoDB Atlas cloud
 */
const connectDB = async (customUri) => {
  try {
    const connUri =
      customUri ||
      process.env.MONGODB_URI ||
      'mongodb://127.0.0.1:27017/student_mgmt_exp9_dev';

    // Mask credentials if present for secure logging
    const maskedUri = connUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[Database] Connecting to: ${maskedUri}`);
    }

    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 5000,
    });

    if (process.env.NODE_ENV !== 'test') {
      console.log(`[Database] MongoDB Connected successfully!`);
      console.log(`[Database] Host: ${conn.connection.host}`);
      console.log(`[Database] Database Name: ${conn.connection.name}`);
    }
    return conn;
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    if (process.env.NODE_ENV !== 'test') {
      console.error(`
---------------------------------------------------------------
Troubleshooting Tips for Experiment 9:
1. Ensure the local MongoDB service is running (or Atlas connection string is valid).
2. Check backend/.env MONGODB_URI.
---------------------------------------------------------------
`);
    }
    return null;
  }
};

/**
 * Disconnect from MongoDB (useful for test teardown)
 */
const disconnectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  } catch (err) {
    console.error('[Database Disconnect Error]:', err.message);
  }
};

module.exports = connectDB;
module.exports.connectDB = connectDB;
module.exports.disconnectDB = disconnectDB;
