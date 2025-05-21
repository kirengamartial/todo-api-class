require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB test connection helper
async function connectDB() {
  try {
    // Use environment variable with fallback
    let mongoURI = process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/todo_db?authSource=admin';
    
    // Convert the connection string to use todo_test database instead of todo_db
    mongoURI = mongoURI.replace('todo_db', 'todo_test');
    
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB test database');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

// Disconnect and cleanup
async function disconnectDB() {
  try {
    await mongoose.connection.dropDatabase(); // Clean up test database
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB test database');
  } catch (err) {
    console.error('MongoDB disconnect error:', err);
  }
}

// Clean collections between tests
async function clearCollections() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}

module.exports = { connectDB, disconnectDB, clearCollections };