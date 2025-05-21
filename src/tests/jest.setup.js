require('dotenv').config();

// Increase the default timeout for all tests
jest.setTimeout(15000);

// Optional: Suppress MongoDB deprecation warnings in test output
process.env.MONGODB_DEPRECATION_WARNINGS = 'false';

// Optional: Silence mongoose deprecation warnings
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);