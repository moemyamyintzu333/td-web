import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';

describe('POST /api/v1/todos Contract Test', () => {
  it('should create a new todo with valid data', async () => {
    const app = express();
    
    const todoData = {
      text: 'Buy groceries'
    };

    const response = await request(app)
      .post('/api/v1/todos')
      .send(todoData)
      .expect('Content-Type', /json/);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.text).toBe(todoData.text);
    expect(response.body.data.completed).toBe(false);
    expect(response.body.data).toHaveProperty('createdAt');
    expect(response.body.data).toHaveProperty('updatedAt');
  });

  it('should reject empty text', async () => {
    const app = express();
    
    const invalidData = {
      text: ''
    };

    const response = await request(app)
      .post('/api/v1/todos')
      .send(invalidData)
      .expect('Content-Type', /json/);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(response.body.error.field).toBe('text');
  });

  it('should reject missing text field', async () => {
    const app = express();
    
    const response = await request(app)
      .post('/api/v1/todos')
      .send({})
      .expect('Content-Type', /json/);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should reject text longer than 500 characters', async () => {
    const app = express();
    
    const longText = 'a'.repeat(501);
    
    const response = await request(app)
      .post('/api/v1/todos')
      .send({ text: longText })
      .expect('Content-Type', /json/);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});
