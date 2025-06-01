// Test Cases for User Authentication 

const request = require('supertest'); 
const app = require('../server'); 
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server'); 
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  await mongoose.connect(mongo.getUri());
  process.env.JWT_SECRET = 'test_secret'; 
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});

describe('User Auth Routes', () => {
  let userId;
  let token;

  // Registering a new user successfully
  it('should register a user successfully', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        full_name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'securepassword123',
        role: 'Student',
        github: 'https://github.com/testuser',
        bio: 'I am a test user.',
        techstack: ['Node.js', 'React']
      });

    expect(res.statusCode).toBe(201); 
    expect(res.body).toHaveProperty('token'); 
    expect(res.body).toMatchObject({
      full_name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      role: 'Student',
      github: 'https://github.com/testuser'
    });

    userId = res.body._id;
    token = res.body.token;
  });

  // Preventing duplicate email registration
  it('should not register user with duplicate email', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        full_name: 'Duplicate Email',
        username: 'uniqueuser',
        email: 'test@example.com', 
        password: 'anotherpassword',
        role: 'Student',
        github: 'https://github.com/anothergithub'
      });

    expect(res.statusCode).toBe(400); 
    expect(res.body.message).toMatch(/email/i); 
  });

  // Preventing duplicate username registration
  it('should not register user with duplicate username', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        full_name: 'Duplicate Username',
        username: 'testuser', 
        email: 'unique@example.com',
        password: 'anotherpassword',
        role: 'Student',
        github: 'https://github.com/uniquegithub'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/username/i);
  });

  // Preventing duplicate GitHub registration
  it('should not register user with duplicate github', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        full_name: 'Duplicate Github',
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'anotherpassword',
        role: 'Student',
        github: 'https://github.com/testuser' 
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/github/i);
  });

  // Logging in with correct credentials
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
        password: 'wrongpassword' 
      });

    expect(res.statusCode).toBe(401); 
    expect(res.body.message).toMatch(/invalid credentials/i);
  });

  // Fetching current user profile using valid JWT
  it('should fetch user profile using token', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`); 

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('test@example.com');
    expect(res.body.username).toBe('testuser');
    expect(res.body.techstack).toContain('Node.js');
  });

  // Failing profile fetch with invalid token
  it('should reject profile fetch with invalid token', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', 'Bearer invalidtoken'); 

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/not authorized/i);
  });

  // Failing registration with missing required fields
  it('should not register with missing required fields', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        username: 'missingfields'
        // Missing full_name, email, password, role
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/all fields/i); 
  });
});
