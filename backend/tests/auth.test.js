// Test Cases for Authentication 
const request = require('supertest'); 
const app = require('../server'); 
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server'); 
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let mongo;

// Sets up proper environment for test cases
beforeAll(async () => {
  // Creates fake DB for testing
  mongo = await MongoMemoryServer.create();
  // Disconnects any other connection 
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  await mongoose.connect(mongo.getUri());
  process.env.JWT_SECRET = 'greg&aarav'; 
});

// Cleans up after test cases run
afterAll(async () => {
  // Wipes test DB
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});

describe('User Auth Routes', () => {
  let userId;
  let token;

  // Only for users without github accounts linked
  it('should register a user successfully', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        full_name: 'Greg Something',
        username: 'greg',
        email: 'greg@gmail.com',
        password: 'Bledge',
        role: 'Student',
        bio: 'My name is Greg',
        techstack: ['MySQL', 'React']
      });

    expect(res.statusCode).toBe(201); 
    expect(res.body).toHaveProperty('token'); 
    expect(res.body).toMatchObject({
      full_name: 'Greg Something',
      username: 'greg',
      email: 'greg@gmail.com',
      role: 'Student'
    });

    userId = res.body._id;
    token = res.body.token;
  });


  it('should not register user with duplicate email', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        full_name: 'Aarav Something',
        username: 'aarav',
        email: 'greg@gmail.com',
        password: 'Bledge',
        role: 'Student',
        bio: 'My name is Aarav',
        techstack: ['Python', 'React']
      });

    expect(res.statusCode).toBe(400); 
    expect(res.body.message).toMatch(/email/i); 
  });


  it('should not register user with duplicate username', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        full_name: 'Aarav Something',
        username: 'greg', 
        email: 'aarav@gmail.com',
        password: 'Bledge',
        role: 'Student'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/username/i);
  });


  it('should login the user with correct credentials', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        username: 'greg',
        password: 'Bledge'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.email).toBe('greg@gmail.com');
  });


  it('should fail login with incorrect password', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        username: 'greg',
        password: 'notBledge' 
      });

    expect(res.statusCode).toBe(401); 
    expect(res.body.message).toMatch(/invalid credentials/i);
  });


  it('should fetch user profile using token', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`); 

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('greg@gmail.com');
    expect(res.body.username).toBe('greg');
    expect(res.body.techstack).toEqual(['MySQL', 'React']);
  });


  it('should reject profile fetch with invalid token', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', 'Wrong token'); 

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/not authorized/i);
  });


  it('should not register with missing required fields', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        username: 'greg'
        // No other fields entered
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/all fields/i); 
  });

});
