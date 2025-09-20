# Data Model: Simple Todo-List Web Application

**Date**: 2025-09-21  
**Feature**: 001-build-a-very

## Entity Definitions

### Todo Item
**Purpose**: Represents a single task item in the user's todo list

**Attributes**:
- `id` (INTEGER PRIMARY KEY): Unique identifier for the todo item
- `text` (TEXT NOT NULL): Description of the task to be completed
- `completed` (BOOLEAN DEFAULT FALSE): Completion status of the todo item
- `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP): When the todo was created
- `updated_at` (DATETIME DEFAULT CURRENT_TIMESTAMP): When the todo was last modified

**Validation Rules**:
- `text` must not be empty or null
- `text` maximum length of 500 characters
- `completed` must be boolean (0 or 1 in SQLite)
- `created_at` and `updated_at` must be valid ISO datetime strings

**Business Rules**:
- Each todo item must have unique `id`
- `text` is required for todo creation
- `completed` defaults to false for new todos
- `updated_at` is automatically updated on any modification

## Database Schema

### SQLite Table: `todos`
```sql
CREATE TABLE todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL CHECK(length(text) > 0 AND length(text) <= 500),
    completed BOOLEAN DEFAULT 0 CHECK(completed IN (0, 1)),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_todos_completed ON todos(completed);
CREATE INDEX idx_todos_created_at ON todos(created_at DESC);
```

### Database Triggers
```sql
-- Automatically update updated_at timestamp
CREATE TRIGGER update_todos_updated_at 
    AFTER UPDATE ON todos
BEGIN
    UPDATE todos SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
```

## Data Access Patterns

### Primary Operations
1. **Create Todo**: Insert new todo with text, default completed=false
2. **Read Todos**: Select all todos ordered by created_at DESC
3. **Update Todo**: Modify text or completed status
4. **Delete Todo**: Remove todo by id

### Query Patterns
- **List All Todos**: `SELECT * FROM todos ORDER BY created_at DESC`
- **Filter by Status**: `SELECT * FROM todos WHERE completed = ? ORDER BY created_at DESC`
- **Find by ID**: `SELECT * FROM todos WHERE id = ?`
- **Count Todos**: `SELECT COUNT(*) FROM todos WHERE completed = ?`

## Data Transfer Objects (DTOs)

### Frontend JSON Format
```javascript
{
  "id": 1,
  "text": "Buy groceries",
  "completed": false,
  "createdAt": "2025-09-21T10:30:00.000Z",
  "updatedAt": "2025-09-21T10:30:00.000Z"
}
```

### API Request/Response Formats

**Create Todo Request**:
```javascript
{
  "text": "Buy groceries"
}
```

**Update Todo Request**:
```javascript
{
  "text": "Buy groceries and cook dinner",
  "completed": true
}
```

**API Response Format**:
```javascript
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

**Error Response Format**:
```javascript
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Todo text cannot be empty",
    "field": "text"
  }
}
```

## State Transitions

### Todo Lifecycle
1. **Created**: `completed = false`, `created_at` set
2. **Completed**: `completed = true`, `updated_at` updated
3. **Uncompleted**: `completed = false`, `updated_at` updated
4. **Modified**: `text` changed, `updated_at` updated
5. **Deleted**: Record removed from database

### Valid State Changes
- Created → Completed
- Created → Modified
- Created → Deleted
- Completed → Uncompleted
- Completed → Modified
- Completed → Deleted
- Modified → Completed
- Modified → Uncompleted
- Modified → Deleted

## Performance Considerations

### Database Optimization
- Primary key index on `id` for fast lookups
- Index on `completed` for filtered queries
- Index on `created_at` for chronological ordering
- Prepared statements for all queries

### Frontend Optimization
- Cache todo list in memory
- Optimistic updates for better UX
- Batch operations where possible
- Minimal DOM manipulation

## Data Integrity

### Constraints
- Non-empty text validation
- Boolean completed field validation
- Automatic timestamp management
- Foreign key constraints (none needed for single entity)

### Error Handling
- Database connection errors
- Constraint violation errors
- Malformed request data
- Missing required fields
