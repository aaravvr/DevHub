// Test Cases for Github OAuth Authentication
const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server.js');
const User = require('../models/userModel');


describe('GitHub OAuth Registration', () => {
  let mongo;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
    process.env.JWT_SECRET = 'greg&aarav';
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
  });


  it('should attach GitHub info and redirect to github', async () => {
    const dummyUser = await User.create({
      full_name: 'Greg Something',
      username: 'greg',
      email: 'greg@gmail.com',
      password: 'Blud',
      role: 'Student',
      bio: 'I am Greg',
      techstack: ['Python']
    });

    const token = jwt.sign({ id: dummyUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const res = await request(app)
      .get(`/auth/github?userId=${dummyUser._id}`);

    // Checks if we redirected to github login page 
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toMatch(/github.com/);
  });


  it('should redirect to error page if userId is invalid or missing', async () => {
    const res = await request(app).get('/auth/github');

    expect(res.statusCode).toBe(302);
    
    // Check if we hit error in github Auth
    expect(res.headers.location).toMatch(/github-error/);
  });


  it('should return 400 if callback is missing userId', async () => {
    const res = await request(app).get('/auth/github/callback');
    expect(res.statusCode).toBe(400);
    expect(res.text).toMatch(/missing local user id/i);
  });


  it('should return 404 if user in state is not found', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();

    // Simulate github callback manually by mocking passport
    const res = await request(app)
      .get(`/auth/github/callback?state=${fakeId}`)
      .set('Authorization', `Bearer Dummy`);

    expect(res.statusCode).toBe(404);
    expect(res.text).toMatch(/user not found/i);
  });
});