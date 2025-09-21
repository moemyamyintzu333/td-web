import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';

describe('DELETE /api/v1/todos/:id Contract Test', () => {
  it('should delete an existing todo', async () => {
    const app = express();
    
    const response = await request(app)
      .delete('/api/v1/todos/1')
      .expect('Content-Type', /json/);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(1);
    expect(response.body.data.deleted).toBe(true);
  });

  it('should return 404 for non-existent todo', async () => {
    const app = express();
    
    const response = await request(app)
      .delete('/api/v1/todos/999')
      .expect('Content-Type', /json/);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('NOT_FOUND');
    expect(response.body.error.id).toBe(999);
  });

  it('should handle invalid ID parameter', async () => {
    const app = express();
    
    const response = await request(app)
      .delete('/api/v1/todos/invalid-id')
      .expect('Content-Type', /json/);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});
