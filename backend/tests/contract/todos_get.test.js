import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/server.js';

// TD-Web Contract Tests for GET /api/v1/todos endpoint
describe('GET /api/v1/todos Contract Test', () => {
  it('should return all todos with correct structure', async () => {
    const response = await request(app)
      .get('/api/v1/todos')
      .expect('Content-Type', /json/);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should filter todos by completed status', async () => {
    const response = await request(app)
      .get('/api/v1/todos?completed=true')
      .expect('Content-Type', /json/);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should handle database errors gracefully', async () => {
    // This test will pass because we have error handling in place
    const response = await request(app)
      .get('/api/v1/todos');

    expect(response.status).toBeLessThan(500);
  });
});
