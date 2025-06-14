// Testcases for Project Authentication
const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/userModel');
const Project = require('../models/projectModel');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'greg&aarav';

let mongo, token, userId;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  await mongoose.connect(mongo.getUri());

  // Create a test user
  const user = await User.create({
    full_name: 'Gregory Smith',
    username: 'gregash',
    email: 'gregash@gmail',
    // Hashed password
    password: '$2a$10$FAKEHASHEDPASSWORD',
    role: 'Student',
    bio: 'My name is Greg. I like movies.',
    techstack: ['MySQL', 'Python']
  })

  userId = user._id;
  token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30h' });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});

describe('Project CRUD', () => {

  it('should create a project successfully', async () => {
    // User doesn't have github, only tests for project creation
    const res = await request(app)
      .post('/api/projects/')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'DevHub',
        desc: 'My orbital project',
        access_type: 'public',
        tech_stack: ['Node', 'MongoDB'],
        tags: ['platform', 'cool', 'MERN'],
        features: [
          { title: 'Chat', desc: 'Realtime' },
          { title: 'Matching', desc: 'AI implemented' }
        ],
        // Fake github info, actual testing in githubAuth test
        github_repo: {
          owner: 'greg',
          repo: 'devhub',
          url: 'https://github.com/greg/devhub'
        },
        fileTree: []
      });

    // Change to 201
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('DevHub');
  });


  it('should fail to create project with missing fields', async () => {
    // Creating project for user without GitHub-linked account
    const res = await request(app)
      .post('/api/projects/')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/missing fields/i)
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

    // Creates project to exist before the following tests
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
          features: [
            { title: 'Chat', desc: 'Realtime' },
            { title: 'Matching', desc: 'AI implemented' }
          ],
          // Fake github info
          github_repo: {
            owner: 'greg',
            repo: 'devhub',
            url: 'https://github.com/greg/devhub'
          },
          fileTree: []
        });

      projectId = res.body._id;
    });


    it('should get project by ID', async () => {
      const res = await request(app)
        .get(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200)
      expect(res.body._id).toBe(projectId)
    });


    it('should not allow users who are not creators to update project', async () => {
      const otherUser = await User.create({
        full_name: 'Aarav Rajesh',
        username: 'rajeans',
        email: 'rajeans@gmail.com',
        password: '$2a$10$RANDOMHASHEDPASSWORD',
        role: 'Student',
        bio: 'I am Aarav. I like to dance.',
        techstack: ['node', 'C++']
      });

      const otherToken = jwt.sign({ id: otherUser._id }, process.env.JWT_SECRET, { expiresIn: '30h' });

      const res = await request(app)
        .put(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ title: 'Not DevHub' });

      console.log("BODY", res.body);
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/not authorized/i);
    
    });

    // Preventing other users from deleting the project
    it('should not allow a different user to delete the project', async () => {
      const otherUser = await User.create({
        full_name: 'Lionel Messi',
        username: 'messi',
        email: 'messi@gmail.com',
        password: '$2a$10$RANDOMHASHEDPASSWORD',
        role: 'Developer',
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

    it('should update project', async () => {
      const res = await request(app)
        .put(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Midpoint',
          desc: 'Greg other project',
          access_type: 'private',
          tech_stack: ['Express', 'MongoDB'],
          tags: ['updated', 'test'],
          github_repo: {
            owner: 'greg',
            repo: 'midpoint',
            url: 'https://github.com/greg/midpoint'
          }
        });

      // Features handled seperately
      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe('Midpoint');
      expect(res.body.desc).toBe('Greg other project');
      expect(res.body.access_type).toBe('private');
      expect(res.body.tech_stack).toEqual(['Express', 'MongoDB']);
      expect(res.body.tags).toEqual(['updated', 'test']);
      expect(res.body.github_repo.repo).toBe('midpoint');
    });


    it('should delete project', async () => {
      const res = await request(app)
        .delete(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/deleted/i);
    });

  });

  it('should allow any user to view a project', async () => {
    // Create a project by one user
    const project = await Project.create({
      title: 'Book In',
      desc: 'This is greg public project',
      access_type: 'public',
      tech_stack: ['React'],
      tags: ['public-access'],
      features: [],
      github_repo: {
        owner: 'greg',
        repo: 'book-in',
        url: 'https://github.com/greg/book-in'
      },
      creator: userId,
      // Filetree tested on frontend
      fileTree: []
    });

    const res = await request(app)
      .get(`/api/projects/${project._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Book In')
  });
});
