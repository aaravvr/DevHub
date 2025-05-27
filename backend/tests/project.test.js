// Testcases for Project Authentication

// Import libraries and dependencies
const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/userModel');
const Project = require('../models/projectModel');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'test_secret';

let mongo, token, userId;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  await mongoose.connect(mongo.getUri());

  // Create a test user
  const user = await User.create({
    full_name: 'Gregory Smith',
    username: 'gregash',
    email: 'gregash@gmail',
    password: '$2a$10$RANDOMHASHEDPASSWORD', // Pre-hashed dummy password
    role: 'student',
    github: 'https://github.com/greg',
    bio: 'My name is Greg. I like movies.',
    techstack: ['nodejs', 'python']
  });

  userId = user._id;
  token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30h' });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});

describe('Project CRUD', () => {

  // Create a valid project
  it('should create a project successfully', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'DevHub',
        desc: 'My orbital project',
        access_type: 'public',
        tech_stack: ['Node', 'MongoDB'],
        tags: ['platform', 'cool', 'MERN'],
        features_wanted: [
          { title: 'Chat', desc: 'Realtime' },
          { title: 'Matching', desc: 'AI implemented' }
        ],
        github_repo: {
          owner: 'greg',
          repo: 'devhub',
          url: 'https://github.com/greg/devhub'
        }
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('DevHub');
  });

  // Attempt to create a project with missing required fields
  it('should fail to create project with missing fields', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/missing fields/i);
  });

  // Attempt to get a project with a fake/nonexistent ID
  it('should return 404 for unknown project', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/projects/${fakeId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });

  describe('when a project exists', () => {
    let projectId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Devhub',
          desc: 'My orbital project',
          access_type: 'public',
          tech_stack: ['Node', 'MongoDB'],
          tags: ['platform', 'cool', 'MERN'],
          features_wanted: [
            { title: 'Chat', desc: 'Realtime' },
            { title: 'Matching', desc: 'AI implemented' }
          ],
          github_repo: {
            owner: 'greg',
            repo: 'devhub',
            url: 'https://github.com/greg/devhub'
          }
        });

      projectId = res.body._id;
    });

    // Retrieve the project by its ID
    it('should get project by ID', async () => {
      const res = await request(app)
        .get(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(projectId);
    });

    // Update the project successfully
    it('should update project', async () => {
      const res = await request(app)
        .put(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'New DevHub' });

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe('New DevHub');
    });

    // Delete the project
    it('should delete project', async () => {
      const res = await request(app)
        .delete(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/deleted/i);
    });

    // Prevent other users from updating the project
    it('should not allow users who are not creators to update project', async () => {
      const otherUser = await User.create({
        full_name: 'Aarav Rajesh',
        username: 'rajeans',
        email: 'rajeans@gmail.com',
        password: '$2a$10$RANDOMHASHEDPASSWORD',
        role: 'student',
        github: 'https://github.com/rajeans',
        bio: 'I am Aarav. I like to dance.',
        techstack: ['node', 'C++']
      });

      const otherToken = jwt.sign({ id: otherUser._id }, process.env.JWT_SECRET, { expiresIn: '30h' });

      const res = await request(app)
        .put(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ title: 'Not DevHub' });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/not authorized/i);
    });

    // Prevent other users from deleting the project
    it('should not allow a different user to delete the project', async () => {
      const otherUser = await User.create({
        full_name: 'Lionel Messi',
        username: 'messi',
        email: 'messi@gmail.com',
        password: '$2a$10$RANDOMHASHEDPASSWORD',
        role: 'employee',
        github: 'https://github.com/messi',
        bio: 'I am Messi. I like football.',
        techstack: ['node', 'C++']
      });

      const otherToken = jwt.sign({ id: otherUser._id }, process.env.JWT_SECRET, { expiresIn: '30h' });

      const res = await request(app)
        .delete(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/not authorized/i);
    });
  });
});
