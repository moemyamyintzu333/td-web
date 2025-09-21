/**
 * TD-Web Backend Server
 * Express.js application server for todo list API
 * Following TD-Web Constitution v1.0.0 standards
 */

import express from 'express';
import cors from 'cors';
import todosRoutes from './routes/todos.js';
import { responseUtilsMiddleware } from './utils/responseUtils.js';

// Create Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add response utilities middleware
app.use(responseUtilsMiddleware);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.sendSuccess({
    status: 'ok',
    service: 'td-web-backend',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/v1', todosRoutes);

// Error handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.sendError(
    err.message || 'Internal server error',
    'INTERNAL_ERROR',
    process.env.NODE_ENV === 'development' ? { stack: err.stack } : null,
    err.status || 500
  );
});

// 404 handler
app.use('*', (req, res) => {
  res.sendNotFoundError('Route', req.originalUrl);
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`TD-Web Backend Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });
}

export default app;
