import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/server.js';

describe('POST /api/v1/todos Contract Test', () => {
  it('should create a new todo with valid data', async () => {
    const todoData = {
      text: 'Buy groceries'
    };

    const response = await request(app)
      .post('/api/v1/todos')
      .send(todoData)
      .expect('Content-Type', /json/);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('text', todoData.text);
    expect(response.body).toHaveProperty('completed', false);
    expect(response.body).toHaveProperty('created_at');
  });

  it('should reject empty text', async () => {
    const invalidData = {
      text: ''
    };

    const response = await request(app)
      .post('/api/v1/todos')
      .send(invalidData)
      .expect('Content-Type', /json/);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should reject missing text field', async () => {
    const response = await request(app)
      .post('/api/v1/todos')
      .send({})
      .expect('Content-Type', /json/);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should reject text longer than 500 characters', async () => {
    const longText = 'a'.repeat(501);

    const response = await request(app)
      .post('/api/v1/todos')
      .send({ text: longText })
      .expect('Content-Type', /json/);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
