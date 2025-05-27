// User Authentication Test Suite

// Import required modules
const request = require('supertest'); // For HTTP request simulation
const app = require('../server'); // Express app
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server'); // In-memory MongoDB for testing
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let mongo;

// Setup: Initialize in-memory MongoDB before running tests
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  await mongoose.connect(mongo.getUri());
  process.env.JWT_SECRET = 'test_secret'; // Set test JWT secret
});

// Cleanup: Drop DB and close connections after all tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});

// Main Test Suite
describe('User Auth Routes', () => {
  let userId;
  let token;

  // Register a new user successfully
  it('should register a user successfully', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        full_name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'securepassword123',
        role: 'student',
        github: 'https://github.com/testuser',
        bio: 'I am a test user.',
        techstack: ['Node.js', 'React']
      });

    expect(res.statusCode).toBe(201); // Created
    expect(res.body).toHaveProperty('token'); // Token is returned
    expect(res.body).toMatchObject({
      full_name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      role: 'student',
      github: 'https://github.com/testuser'
    });

    userId = res.body._id;
    token = res.body.token;
  });

  // Prevent duplicate email registration
  it('should not register user with duplicate email', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        full_name: 'Duplicate Email',
        username: 'uniqueuser',
        email: 'test@example.com', // already used
        password: 'anotherpassword',
        role: 'student',
        github: 'https://github.com/anothergithub'
      });

    expect(res.statusCode).toBe(400); // Bad Request
    expect(res.body.message).toMatch(/email/i); // Message mentions "email"
  });

  // Prevent duplicate username registration
  it('should not register user with duplicate username', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        full_name: 'Duplicate Username',
        username: 'testuser', // already used
        email: 'unique@example.com',
        password: 'anotherpassword',
        role: 'student',
        github: 'https://github.com/uniquegithub'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/username/i);
  });

  // Prevent duplicate GitHub registration
  it('should not register user with duplicate github', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        full_name: 'Duplicate Github',
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'anotherpassword',
        role: 'student',
        github: 'https://github.com/testuser' // already used
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/github/i);
  });

  // Login with correct credentials
  it('should login the user with correct credentials', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        username: 'testuser',
        password: 'securepassword123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.email).toBe('test@example.com');
  });

  // Fail login with incorrect password
  it('should fail login with incorrect password', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        username: 'testuser',
        password: 'wrongpassword' // wrong password
      });

    expect(res.statusCode).toBe(401); // Unauthorized
    expect(res.body.message).toMatch(/invalid credentials/i);
  });

  // Fetch current user profile using valid JWT
  it('should fetch user profile using token', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`); // Pass JWT

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('test@example.com');
    expect(res.body.username).toBe('testuser');
    expect(res.body.techstack).toContain('Node.js');
  });

  // Fail profile fetch with invalid token
  it('should reject profile fetch with invalid token', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', 'Bearer invalidtoken'); // Malformed token

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/not authorized/i);
  });

  // Fail registration with missing required fields
  it('should not register with missing required fields', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        username: 'missingfields'
        // Missing full_name, email, password, role
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/all fields/i); // Validation error
  });
});
