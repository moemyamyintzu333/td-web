import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/server.js';

describe('PUT /api/v1/todos/:id Contract Test', () => {
  it('should update an existing todo', async () => {
    // First create a todo to update
    const createResponse = await request(app)
      .post('/api/v1/todos')
      .send({ text: 'Original todo text' });
    
    const todoId = createResponse.body.id;

    const updateData = {
      text: 'Updated todo text',
      completed: true
    };

    const response = await request(app)
      .put(`/api/v1/todos/${todoId}`)
      .send(updateData)
      .expect('Content-Type', /json/);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', todoId);
    expect(response.body).toHaveProperty('text', updateData.text);
    expect(response.body).toHaveProperty('completed', updateData.completed);
  });

  it('should allow partial updates', async () => {
    // First create a todo to update
    const createResponse = await request(app)
      .post('/api/v1/todos')
      .send({ text: 'Original todo text' });
    
    const todoId = createResponse.body.id;

    const partialUpdate = {
      completed: true
    };

    const response = await request(app)
      .put(`/api/v1/todos/${todoId}`)
      .send(partialUpdate)
      .expect('Content-Type', /json/);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('completed', true);
  });

  it('should return 404 for non-existent todo', async () => {
    const response = await request(app)
      .put('/api/v1/todos/999')
      .send({ text: 'Update non-existent' })
      .expect('Content-Type', /json/);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  it('should validate text length on update', async () => {
    const longText = 'a'.repeat(501);

    const response = await request(app)
      .put('/api/v1/todos/1')
      .send({ text: longText })
      .expect('Content-Type', /json/);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should validate completed field type', async () => {
    const response = await request(app)
      .put('/api/v1/todos/1')
      .send({ completed: 'invalid' })
      .expect('Content-Type', /json/);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
