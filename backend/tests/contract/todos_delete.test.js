import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/server.js';

describe('DELETE /api/v1/todos/:id Contract Test', () => {
  it('should delete an existing todo', async () => {
    // First create a todo to delete
    const createResponse = await request(app)
      .post('/api/v1/todos')
      .send({ text: 'Todo to delete' });
    
    const todoId = createResponse.body.id;

    const response = await request(app)
      .delete(`/api/v1/todos/${todoId}`)
      .expect('Content-Type', /json/);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('id', todoId);
  });

  it('should return 404 for non-existent todo', async () => {
    const response = await request(app)
      .delete('/api/v1/todos/999')
      .expect('Content-Type', /json/);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  it('should handle invalid ID parameter', async () => {
    const response = await request(app)
      .delete('/api/v1/todos/invalid-id')
      .expect('Content-Type', /json/);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
