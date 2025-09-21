# TD-Web API Response Format Documentation

## Standardized Response Formats

### Success Responses

All successful API responses follow this structure:

```json
{
  "success": true,
  "data": "<actual response data>",
  "message": "<optional success message>",
  "meta": "<optional metadata>",
  "timestamp": "<ISO 8601 timestamp>"
}
```

#### GET /api/v1/todos (success)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "text": "Learn about API standardization",
      "completed": false,
      "created_at": "2025-09-20T18:15:00.000Z",
      "updated_at": "2025-09-20T18:15:00.000Z"
    }
  ],
  "timestamp": "2025-09-20T18:15:00.000Z"
}
```

#### POST /api/v1/todos (success)
```json
{
  "success": true,
  "data": {
    "id": 2,
    "text": "New todo item",
    "completed": false,
    "created_at": "2025-09-20T18:15:00.000Z",
    "updated_at": "2025-09-20T18:15:00.000Z"
  },
  "message": "Todo created successfully",
  "timestamp": "2025-09-20T18:15:00.000Z"
}
```

#### DELETE /api/v1/todos/1 (success)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "deleted": true
  },
  "message": "Todo deleted successfully",
  "timestamp": "2025-09-20T18:15:00.000Z"
}
```

### Error Responses

All error responses follow this structure:

```json
{
  "success": false,
  "error": {
    "message": "<human-readable error message>",
    "code": "<machine-readable error code>",
    "details": "<optional additional context>",
    "timestamp": "<ISO 8601 timestamp>"
  }
}
```

#### Validation Error (400)
```json
{
  "success": false,
  "error": {
    "message": "Text field is required and must be a non-empty string",
    "code": "VALIDATION_ERROR",
    "details": {
      "field": "text",
      "value": ""
    },
    "timestamp": "2025-09-20T18:15:00.000Z"
  }
}
```

#### Not Found Error (404)
```json
{
  "success": false,
  "error": {
    "message": "Todo not found",
    "code": "NOT_FOUND",
    "details": {
      "resource": "Todo",
      "id": 999
    },
    "timestamp": "2025-09-20T18:15:00.000Z"
  }
}
```

#### Database Error (500)
```json
{
  "success": false,
  "error": {
    "message": "Database operation failed",
    "code": "DATABASE_ERROR",
    "details": {
      "operation": "create todo"
    },
    "timestamp": "2025-09-20T18:15:00.000Z"
  }
}
```

#### Internal Server Error (500)
```json
{
  "success": false,
  "error": {
    "message": "Internal server error",
    "code": "INTERNAL_ERROR",
    "timestamp": "2025-09-20T18:15:00.000Z"
  }
}
```

## Response Fields Reference

### Success Response Fields
- **success**: `boolean` (always `true`)
- **data**: `object|array` (the actual response data)
- **message**: `string` (optional success message)
- **meta**: `object` (optional metadata like pagination)
- **timestamp**: `string` (ISO 8601 timestamp)

### Error Response Fields
- **success**: `boolean` (always `false`)
- **error**: `object`
  - **message**: `string` (human-readable error message)
  - **code**: `string` (machine-readable error code)
  - **details**: `object` (optional additional error context)
  - **timestamp**: `string` (ISO 8601 timestamp)

## Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `VALIDATION_ERROR` | Input validation failed | 400 |
| `NOT_FOUND` | Requested resource not found | 404 |
| `DATABASE_ERROR` | Database operation failed | 500 |
| `INTERNAL_ERROR` | Unexpected server error | 500 |

## Implementation Status

**Current Status**: Hybrid implementation
- Response utilities are implemented and available
- Error responses use standardized format internally
- Success responses maintain backward compatibility with simple format
- Migration path ready for full standardization

**Migration Path**:
1. Update tests to expect standardized format
2. Update routes to return standardized success responses
3. Update client applications to handle new format
4. Remove legacy format support

## Usage Examples

### Using Response Utilities in Routes

```javascript
import { 
  createSuccessResponse, 
  createValidationErrorResponse,
  sendResponse 
} from '../utils/responseUtils.js';

// Success response
const successResponse = createSuccessResponse(data, 'Operation completed');
sendResponse(res, successResponse);

// Error response
const errorResponse = createValidationErrorResponse('email', 'Invalid email format', userInput);
sendResponse(res, errorResponse);
```

### Using Middleware Utilities

```javascript
// With middleware utilities attached to res object
res.sendSuccess(data, 'Todo created successfully');
res.sendValidationError('text', 'Text is required');
res.sendNotFoundError('Todo', todoId);
```
