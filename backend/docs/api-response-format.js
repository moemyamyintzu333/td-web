/**
 * TD-Web API Response Format Documentation
 * Demonstrates standardized response formats
 */

// SUCCESS RESPONSES
// =================

// GET /api/v1/todos (success)
const getTodosSuccessResponse = {
  'success': true,
  'data': [
    {
      'id': 1,
      'text': 'Learn about API standardization',
      'completed': false,
      'created_at': '2025-09-20T18:15:00.000Z',
      'updated_at': '2025-09-20T18:15:00.000Z'
    }
  ],
  'timestamp': '2025-09-20T18:15:00.000Z'
};

// POST /api/v1/todos (success)
const createTodoSuccessResponse = {
  'success': true,
  'data': {
    'id': 2,
    'text': 'New todo item',
    'completed': false,
    'created_at': '2025-09-20T18:15:00.000Z',
    'updated_at': '2025-09-20T18:15:00.000Z'
  },
  'message': 'Todo created successfully',
  'timestamp': '2025-09-20T18:15:00.000Z'
};

// DELETE /api/v1/todos/1 (success)
const deleteTodoSuccessResponse = {
  'success': true,
  'data': {
    'id': 1,
    'deleted': true
  },
  'message': 'Todo deleted successfully',
  'timestamp': '2025-09-20T18:15:00.000Z'
};

// ERROR RESPONSES
// ===============

// Validation Error (400)
const validationErrorResponse = {
  'success': false,
  'error': {
    'message': 'Text field is required and must be a non-empty string',
    'code': 'VALIDATION_ERROR',
    'details': {
      'field': 'text',
      'value': ''
    },
    'timestamp': '2025-09-20T18:15:00.000Z'
  }
};

// Not Found Error (404)
const notFoundErrorResponse = {
  'success': false,
  'error': {
    'message': 'Todo not found',
    'code': 'NOT_FOUND',
    'details': {
      'resource': 'Todo',
      'id': 999
    },
    'timestamp': '2025-09-20T18:15:00.000Z'
  }
};

// Database Error (500)
const databaseErrorResponse = {
  'success': false,
  'error': {
    'message': 'Database operation failed',
    'code': 'DATABASE_ERROR',
    'details': {
      'operation': 'create todo'
    },
    'timestamp': '2025-09-20T18:15:00.000Z'
  }
};

// Internal Server Error (500)
const internalErrorResponse = {
  'success': false,
  'error': {
    'message': 'Internal server error',
    'code': 'INTERNAL_ERROR',
    'timestamp': '2025-09-20T18:15:00.000Z'
  }
};

// RESPONSE FIELDS REFERENCE
// =========================
//
// SUCCESS RESPONSES:
// - success: boolean (always true)
// - data: object|array (the actual response data)
// - message: string (optional success message)
// - meta: object (optional metadata like pagination)
// - timestamp: string (ISO 8601 timestamp)
//
// ERROR RESPONSES:
// - success: boolean (always false)
// - error: object
//   - message: string (human-readable error message)
//   - code: string (machine-readable error code)
//   - details: object (optional additional error context)
//   - timestamp: string (ISO 8601 timestamp)
//
// ERROR CODES:
// - VALIDATION_ERROR: Input validation failed
// - NOT_FOUND: Requested resource not found
// - DATABASE_ERROR: Database operation failed
// - INTERNAL_ERROR: Unexpected server error

// Export all response examples
module.exports = {
  getTodosSuccessResponse,
  createTodoSuccessResponse,
  deleteTodoSuccessResponse,
  validationErrorResponse,
  notFoundErrorResponse,
  databaseErrorResponse,
  internalErrorResponse
};
