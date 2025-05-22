// Import testing library and server
const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

// Import local memory mongoose to avoid testing on actual DB
const { MongoMemoryServer } = require('mongodb-memory-server');

// Get required user, project models and jwt
const User = require('../models/userModel');
const Project = require('../models/projectModel');
const jwt = require('jsonwebtoken');

let mongo, token, userId;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  await mongoose.connect(mongo.getUri());

  // Create test user and token
  const user = await User.create({
    full_name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
    password: '$2a$10$RANDOMHASHEDPASSWORD', // Pre-hashed or use bcrypt
    role: 'student',
    github: 'https://github.com/test',
    bio: 'test bio',
    techstack: ['node']
  });

  userId = user._id;
  token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});

describe('Project CRUD', () => {

  it('should create a project successfully', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Project 1',
        desc: 'A sample project',
        access_type: 'public',
        tech_stack: ['Node', 'MongoDB'],
        tags: ['tag1'],
        features_wanted: [{ title: 'Chat', desc: 'Realtime' }],
        github_repo: {
          owner: 'testuser',
          repo: 'devhub',
          url: 'https://github.com/testuser/devhub'
        }
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Project 1');
  });

  it('should fail to create project with missing fields', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Missing required project fields/i);
  });

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
          title: 'Temp Project',
          desc: 'Temporary project for testing',
          access_type: 'private',
          tech_stack: ['Express'],
          tags: ['temp'],
          features_wanted: [{ title: 'Collab', desc: 'Live collaboration' }],
          github_repo: {
            owner: 'testuser',
            repo: 'temp-repo',
            url: 'https://github.com/testuser/temp-repo'
          }
        });

      projectId = res.body._id;
    });

    it('should get project by ID', async () => {
      const res = await request(app)
        .get(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(projectId);
    });

    it('should update project', async () => {
      const res = await request(app)
        .put(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated Project Title' });

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe('Updated Project Title');
    });

    it('should delete project', async () => {
      const res = await request(app)
        .delete(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/deleted/i);
    });

    it('should not allow users who are not creators to update project', async () => {
      const otherUser = await User.create({
        full_name: 'Other User',
        username: 'otheruser',
        email: 'other@example.com',
        password: '$2a$10$RANDOMHASHEDPASSWORD',
        role: 'student',
        github: 'https://github.com/other',
        bio: 'other bio',
        techstack: ['node']
      });

      const otherToken = jwt.sign({ id: otherUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      const res = await request(app)
        .put(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ title: 'Unauthorized Update' });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/not authorized/i);
    });

    it('should not allow a different user to delete the project', async () => {
      const otherUser = await User.create({
        full_name: 'Other User',
        username: 'otheruser2',
        email: 'other2@example.com',
        password: '$2a$10$RANDOMHASHEDPASSWORD',
        role: 'student',
        github: 'https://github.com/other2',
        bio: 'other bio',
        techstack: ['node']
      });

      const otherToken = jwt.sign({ id: otherUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      const res = await request(app)
        .delete(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/not authorized/i);
    });
  });

});