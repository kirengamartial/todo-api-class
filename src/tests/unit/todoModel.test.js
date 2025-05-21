const mongoose = require('mongoose');
const { connectDB, disconnectDB, clearCollections } = require('../setup');
const Todo = require('../../models/Todo');

// Increase Jest timeout for MongoDB operations
jest.setTimeout(15000);

describe('Todo Model Test', () => {
  // Connect to test database before all tests
  beforeAll(async () => {
    await connectDB();
  });

  // Disconnect after all tests
  afterAll(async () => {
    await disconnectDB();
  });

  // Clear data after each test
  afterEach(async () => {
    await clearCollections();
  });

  it('should create and save a todo successfully', async () => {
    const validTodo = new Todo({
      title: 'Test Todo',
      description: 'This is a test todo',
      completed: false
    });
    
    const savedTodo = await validTodo.save();
    
    // Object Id should be defined when successfully saved to MongoDB
    expect(savedTodo._id).toBeDefined();
    expect(savedTodo.title).toBe('Test Todo');
    expect(savedTodo.description).toBe('This is a test todo');
    expect(savedTodo.completed).toBe(false);
    expect(savedTodo.createdAt).toBeDefined();
    expect(savedTodo.updatedAt).toBeDefined();
  });

  it('should fail to save a todo without a required field', async () => {
    const todoWithoutRequiredField = new Todo({ description: 'Test without title' });
    
    let error;
    try {
      await todoWithoutRequiredField.save();
    } catch (err) {
      error = err;
    }
    
    expect(error).toBeDefined();
    expect(error.errors.title).toBeDefined();
  });

  it('should fail to save a todo with title longer than max length', async () => {
    const todoWithLongTitle = new Todo({
      title: 'a'.repeat(101), // Title with 101 characters (max is 100)
      description: 'Test with long title'
    });
    
    let error;
    try {
      await todoWithLongTitle.save();
    } catch (err) {
      error = err;
    }
    
    expect(error).toBeDefined();
    expect(error.errors.title).toBeDefined();
  });

  it('should set default value for completed field if not provided', async () => {
    const todoWithoutCompleted = new Todo({
      title: 'Todo without completed field',
      description: 'This should have default value for completed'
    });
    
    const savedTodo = await todoWithoutCompleted.save();
    
    expect(savedTodo.completed).toBe(false);
  });
});