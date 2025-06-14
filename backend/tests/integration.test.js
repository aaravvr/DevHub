// Test cases for Full Project Integrated Workflows
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/userModel');
const Project = require('../models/projectModel');
const jwt = require('jsonwebtoken');

describe('Integration: User and Project flow', () => {
  let mongo;
  let token;
  let userId;
  let projectId;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
    process.env.JWT_SECRET = 'greg&aarav';

    const user = await User.create({
      full_name: 'Greg Something',
      username: 'greg',
      email: 'greg@gmail.com',
      password: '$2a$10$FAKEHASHEDPASS',
      role: 'Student',
      bio: 'I am greg.',
      techstack: ['NodeJS', 'React']
    });

    userId = user._id;
    token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
  });

  it('should allow a user to create a project and retrieve it', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'My Integration Project',
        desc: 'Testing integration',
        access_type: 'public',
        tech_stack: ['Python'],
        tags: ['int-test'],
        features: [{ title: 'chat', desc: 'live chat please' }],
        github_repo: {
          owner: 'greg',
          repo: 'int-repo',
          url: 'https://github.com/greg/int-repo'
        },
        fileTree: []
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('My Integration Project');

    projectId = res.body._id;

    const getRes = await request(app)
      .get(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.title).toBe('My Integration Project');
  });

});