const request = require('supertest');
const mongoose = require('mongoose');
const { connectDB, disconnectDB, clearCollections } = require('../setup');
const app = require('../../app');
const Todo = require('../../models/Todo');

// Increase Jest timeout for MongoDB operations
jest.setTimeout(15000);

describe('Todo API Integration Tests', () => {
  
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  beforeEach(async () => {
    await clearCollections();
  });

  // Test GET /api/todos
  describe('GET /api/todos', () => {
    it('should get all todos', async () => {
      // Create test todos
      await Todo.create([
        { title: 'First todo', description: 'First todo description' },
        { title: 'Second todo', description: 'Second todo description' }
      ]);
      
      const res = await request(app).get('/api/todos');
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.count).toBe(2);
      expect(res.body.data[0].title).toBe('First todo');
    });

    it('should return empty array when no todos exist', async () => {
      const res = await request(app).get('/api/todos');
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.count).toBe(0);
    });
  });

  // Test GET /api/todos/:id
  describe('GET /api/todos/:id', () => {
    it('should get a single todo by ID', async () => {
      const todo = await Todo.create({
        title: 'Test todo',
        description: 'Test description'
      });
      
      const res = await request(app).get(`/api/todos/${todo._id}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(todo._id.toString());
      expect(res.body.data.title).toBe('Test todo');
    });

    it('should return 404 if todo not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/todos/${nonExistentId}`);
      
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Todo not found');
    });

    it('should return 400 for invalid ID format', async () => {
      const res = await request(app).get('/api/todos/invalidid');
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Invalid todo ID');
    });
  });

  // Test POST /api/todos
  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const todoData = {
        title: 'New todo',
        description: 'New todo description',
        completed: true
      };
      
      const res = await request(app)
        .post('/api/todos')
        .send(todoData);
      
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('New todo');
      expect(res.body.data.description).toBe('New todo description');
      expect(res.body.data.completed).toBe(true);
      
      // Verify it was saved to the database
      const savedTodo = await Todo.findById(res.body.data._id);
      expect(savedTodo).not.toBeNull();
    });

    it('should return 400 for missing required fields', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({ description: 'Missing title' });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBeDefined();
    });
  });

  // Test PUT /api/todos/:id
  describe('PUT /api/todos/:id', () => {
    it('should update an existing todo', async () => {
      const todo = await Todo.create({
        title: 'Original title',
        description: 'Original description',
        completed: false
      });
      
      const updateData = {
        title: 'Updated title',
        completed: true
      };
      
      const res = await request(app)
        .put(`/api/todos/${todo._id}`)
        .send(updateData);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Updated title');
      expect(res.body.data.description).toBe('Original description'); // Not updated
      expect(res.body.data.completed).toBe(true);
      
      // Verify changes in database
      const updatedTodo = await Todo.findById(todo._id);
      expect(updatedTodo.title).toBe('Updated title');
      expect(updatedTodo.completed).toBe(true);
    });

    it('should return 404 if todo not found for update', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/todos/${nonExistentId}`)
        .send({ title: 'Updated title' });
      
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Todo not found');
    });
  });

  // Test DELETE /api/todos/:id
  describe('DELETE /api/todos/:id', () => {
    it('should delete an existing todo', async () => {
      const todo = await Todo.create({
        title: 'Todo to delete',
        description: 'Will be deleted'
      });
      
      const res = await request(app).delete(`/api/todos/${todo._id}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      
      // Verify it was deleted from database
      const deletedTodo = await Todo.findById(todo._id);
      expect(deletedTodo).toBeNull();
    });

    it('should return 404 if todo not found for deletion', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/todos/${nonExistentId}`);
      
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Todo not found');
    });
  });
});