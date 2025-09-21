import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';

describe('PUT /api/v1/todos/:id Contract Test', () => {
  it('should update an existing todo', async () => {
    const app = express();
    
    const updateData = {
      text: 'Updated todo text',
      completed: true
    };

    const response = await request(app)
      .put('/api/v1/todos/1')
      .send(updateData)
      .expect('Content-Type', /json/);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(1);
    expect(response.body.data.text).toBe(updateData.text);
    expect(response.body.data.completed).toBe(updateData.completed);
    expect(response.body.data).toHaveProperty('updatedAt');
  });

  it('should allow partial updates', async () => {
    const app = express();
    
    const partialUpdate = {
      completed: true
    };

    const response = await request(app)
      .put('/api/v1/todos/1')
      .send(partialUpdate)
      .expect('Content-Type', /json/);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.completed).toBe(true);
  });

  it('should return 404 for non-existent todo', async () => {
    const app = express();
    
    const response = await request(app)
      .put('/api/v1/todos/999')
      .send({ text: 'Update non-existent' })
      .expect('Content-Type', /json/);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('NOT_FOUND');
    expect(response.body.error.id).toBe(999);
  });

  it('should validate text length on update', async () => {
    const app = express();
    
    const longText = 'a'.repeat(501);
    
    const response = await request(app)
      .put('/api/v1/todos/1')
      .send({ text: longText })
      .expect('Content-Type', /json/);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should validate completed field type', async () => {
    const app = express();
    
    const response = await request(app)
      .put('/api/v1/todos/1')
      .send({ completed: 'invalid' })
      .expect('Content-Type', /json/);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});
