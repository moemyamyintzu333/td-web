# API Contract: Todo Operations

**Version**: 1.0.0  
**Base URL**: `/api/v1`

## Endpoints

### GET /todos
**Purpose**: Retrieve all todo items

**Request**:
- Method: `GET`
- URL: `/api/v1/todos`
- Query Parameters:
  - `completed` (optional): `true` | `false` | omitted for all
- Headers: `Content-Type: application/json`

**Response 200 OK**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "text": "Buy groceries",
      "completed": false,
      "createdAt": "2025-09-21T10:30:00.000Z",
      "updatedAt": "2025-09-21T10:30:00.000Z"
    }
  ]
}
```

**Response 500 Internal Server Error**:
```json
{
  "success": false,
  "error": {
    "code": "DATABASE_ERROR",
    "message": "Failed to retrieve todos"
  }
}
```

### POST /todos
**Purpose**: Create a new todo item

**Request**:
- Method: `POST`
- URL: `/api/v1/todos`
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "text": "Buy groceries"
}
```

**Response 201 Created**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "text": "Buy groceries",
    "completed": false,
    "createdAt": "2025-09-21T10:30:00.000Z",
    "updatedAt": "2025-09-21T10:30:00.000Z"
  }
}
```

**Response 400 Bad Request**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Todo text is required",
    "field": "text"
  }
}
```

### PUT /todos/:id
**Purpose**: Update an existing todo item

**Request**:
- Method: `PUT`
- URL: `/api/v1/todos/{id}`
- Headers: `Content-Type: application/json`
- Body (partial updates allowed):
```json
{
  "text": "Buy groceries and cook dinner",
  "completed": true
}
```

**Response 200 OK**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "text": "Buy groceries and cook dinner",
    "completed": true,
    "createdAt": "2025-09-21T10:30:00.000Z",
    "updatedAt": "2025-09-21T11:15:00.000Z"
  }
}
```

**Response 404 Not Found**:
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Todo item not found",
    "id": 999
  }
}
```

### DELETE /todos/:id
**Purpose**: Delete a todo item

**Request**:
- Method: `DELETE`
- URL: `/api/v1/todos/{id}`
- Headers: `Content-Type: application/json`

**Response 200 OK**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "deleted": true
  }
}
```

**Response 404 Not Found**:
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Todo item not found",
    "id": 999
  }
}
```

## Request/Response Standards

### Common Headers
- `Content-Type: application/json`
- `Accept: application/json`

### Error Codes
- `VALIDATION_ERROR`: Invalid request data
- `NOT_FOUND`: Resource not found
- `DATABASE_ERROR`: Internal database error
- `SERVER_ERROR`: General server error

### HTTP Status Codes
- `200 OK`: Successful operation
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

### Response Format
All responses follow the standard format:
```json
{
  "success": boolean,
  "data": object | array,     // On success
  "error": {                  // On error
    "code": "ERROR_CODE",
    "message": "Human readable error",
    "field": "fieldName"      // Optional for validation errors
  }
}
```

### Validation Rules
- `text` field: 1-500 characters, non-empty string
- `completed` field: boolean values only
- `id` parameter: positive integer
- JSON payloads: valid JSON format required
