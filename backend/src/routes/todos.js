/**
 * TD-Web Todo API Routes
 * RESTful API endpoints for todo operations
 * Following TD-Web Constitution v1.0.0 standards
 */

import express from 'express';
import TodoService from '../services/todoService.js';
import { 
  createValidationErrorResponse,
  createNotFoundErrorResponse,
  createDatabaseErrorResponse 
} from '../utils/responseUtils.js';

const router = express.Router();

// GET /api/v1/todos - Retrieve all todos with optional filtering
router.get('/todos', async (req, res) => {
  try {
    const { completed } = req.query;
    const filters = {};

    // Parse completed filter
    if (completed !== undefined) {
      if (completed === 'true') {
        filters.completed = true;
      } else if (completed === 'false') {
        filters.completed = false;
      }
    }

    const todos = TodoService.getAllTodos(filters);
    
    // For backward compatibility, return simple format
    // TODO: Migrate to standardized format: res.json(createSuccessResponse(todos));
    res.json(todos);
  } catch (error) {
    console.error('Error in GET /todos:', error);
    
    // Use standardized error response
    const errorResponse = createDatabaseErrorResponse('retrieve todos', error);
    res.status(errorResponse._status).json({
      error: errorResponse.error.message,
      timestamp: errorResponse.error.timestamp
    });
  }
});

// POST /api/v1/todos - Create a new todo
router.post('/todos', async (req, res) => {
  try {
    const { text } = req.body;
    
    // Basic validation using standardized responses
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      const errorResponse = createValidationErrorResponse(
        'text', 
        'Text field is required and must be a non-empty string',
        text
      );
      return res.status(errorResponse._status).json({
        error: errorResponse.error.message,
        timestamp: errorResponse.error.timestamp
      });
    }
    
    if (text.length > 500) {
      const errorResponse = createValidationErrorResponse(
        'text',
        'Text field must be 500 characters or less',
        text
      );
      return res.status(errorResponse._status).json({
        error: errorResponse.error.message,
        timestamp: errorResponse.error.timestamp
      });
    }
    
    const newTodo = TodoService.createTodo({ text });
    
    // For backward compatibility, return simple format
    // TODO: Migrate to standardized format: res.status(201).json(createSuccessResponse(newTodo));
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error in POST /todos:', error);
    
    const errorResponse = createDatabaseErrorResponse('create todo', error);
    res.status(errorResponse._status).json({
      error: errorResponse.error.message,
      timestamp: errorResponse.error.timestamp
    });
  }
});

// PUT /api/v1/todos/:id - Update an existing todo
router.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;
    
    // Validate ID using standardized responses
    if (!/^\d+$/.test(id)) {
      const errorResponse = createValidationErrorResponse(
        'id',
        'Invalid todo ID format',
        id
      );
      return res.status(errorResponse._status).json({
        error: errorResponse.error.message,
        timestamp: errorResponse.error.timestamp
      });
    }
    
    // Validate text if provided
    if (text !== undefined) {
      if (typeof text !== 'string' || text.trim().length === 0) {
        const errorResponse = createValidationErrorResponse(
          'text',
          'Text field must be a non-empty string',
          text
        );
        return res.status(errorResponse._status).json({
          error: errorResponse.error.message,
          timestamp: errorResponse.error.timestamp
        });
      }
      
      if (text.length > 500) {
        const errorResponse = createValidationErrorResponse(
          'text',
          'Text field must be 500 characters or less',
          text
        );
        return res.status(errorResponse._status).json({
          error: errorResponse.error.message,
          timestamp: errorResponse.error.timestamp
        });
      }
    }
    
    // Validate completed if provided
    if (completed !== undefined && typeof completed !== 'boolean') {
      const errorResponse = createValidationErrorResponse(
        'completed',
        'Completed field must be a boolean',
        completed
      );
      return res.status(errorResponse._status).json({
        error: errorResponse.error.message,
        timestamp: errorResponse.error.timestamp
      });
    }
    
    const updatedTodo = TodoService.updateTodo(parseInt(id), { text, completed });
    
    if (!updatedTodo) {
      const errorResponse = createNotFoundErrorResponse('Todo', parseInt(id));
      return res.status(errorResponse._status).json({
        error: errorResponse.error.message,
        timestamp: errorResponse.error.timestamp
      });
    }
    
    // For backward compatibility, return simple format
    // TODO: Migrate to standardized format: res.json(createSuccessResponse(updatedTodo));
    res.json(updatedTodo);
  } catch (error) {
    console.error('Error in PUT /todos/:id:', error);
    
    const errorResponse = createDatabaseErrorResponse('update todo', error);
    res.status(errorResponse._status).json({
      error: errorResponse.error.message,
      timestamp: errorResponse.error.timestamp
    });
  }
});

// DELETE /api/v1/todos/:id - Delete a todo
router.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID using standardized responses
    if (!/^\d+$/.test(id)) {
      const errorResponse = createValidationErrorResponse(
        'id',
        'Invalid todo ID format',
        id
      );
      return res.status(errorResponse._status).json({
        error: errorResponse.error.message,
        timestamp: errorResponse.error.timestamp
      });
    }
    
    const deleted = TodoService.deleteTodo(parseInt(id));
    
    if (!deleted) {
      const errorResponse = createNotFoundErrorResponse('Todo', parseInt(id));
      return res.status(errorResponse._status).json({
        error: errorResponse.error.message,
        timestamp: errorResponse.error.timestamp
      });
    }
    
    // For backward compatibility, return simple format
    // TODO: Migrate to standardized format with success message
    res.json({
      message: 'Todo deleted successfully',
      id: parseInt(id),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in DELETE /todos/:id:', error);
    
    const errorResponse = createDatabaseErrorResponse('delete todo', error);
    res.status(errorResponse._status).json({
      error: errorResponse.error.message,
      timestamp: errorResponse.error.timestamp
    });
  }
});

export default router;
