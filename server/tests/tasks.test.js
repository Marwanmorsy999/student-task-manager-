process.env.JWT_SECRET = 'test_secret_for_ci';
const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const Task = require('../src/models/Task');
const User = require('../src/models/User');

const { MongoMemoryServer } = require('mongodb-memory-server');

let token;
let userId;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // Create a user and get token
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Test User', email: 'test1@test.com', password: 'Password@123' });
  
  token = res.body.token;
  userId = res.body._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Task API Endpoints', () => {
  let taskId;

  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Integration Test Task',
        description: 'Testing task creation',
        dueDate: '2026-12-31',
        priority: 'high',
        category: 'Programming'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('New Integration Test Task');
    taskId = res.body._id;
  });

  it('should get all tasks for the logged-in user', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].title).toBe('New Integration Test Task');
  });

  it('should update an existing task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'done' });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('done');
  });

  it('should delete a task', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Task deleted');
  });
});
