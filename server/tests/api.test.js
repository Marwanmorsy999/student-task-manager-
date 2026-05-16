const request = require('supertest');
const app = require('../src/app');

// ── Auth routes ──────────────────────────────────────────────
describe('POST /api/auth/register', () => {
  it('returns 400 when name is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@test.com', password: 'Password@123' });
    expect(res.statusCode).toBe(400);
  });

  it('returns 400 for invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'not-an-email', password: 'Password@123' });
    expect(res.statusCode).toBe(400);
  });

  it('returns 400 for short password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@test.com', password: 'Short1!' });
    expect(res.statusCode).toBe(400);
  });

  it('returns 400 for password missing uppercase', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@test.com', password: 'password123!' });
    expect(res.statusCode).toBe(400);
  });

  it('returns 400 for password missing special char', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@test.com', password: 'Password123' });
    expect(res.statusCode).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  it('returns 400 for invalid email format', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'bad', password: 'Password@123' });
    expect(res.statusCode).toBe(400);
  });
});

// ── Task routes ─────────────────────────────────────────────
describe('GET /api/tasks', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(401);
  });
});

describe('POST /api/tasks', () => {
  it('returns 401 without a token', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test', dueDate: '2025-12-01', priority: 'low' });
    expect(res.statusCode).toBe(401);
  });
});

// ── Health check ─────────────────────────────────────────────
describe('GET /api/health', () => {
  it('returns status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
