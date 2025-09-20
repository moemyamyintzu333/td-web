# Quickstart Guide: Simple Todo-List Web Application

**Feature**: 001-build-a-very  
**Date**: 2025-09-21

## Development Setup

### Prerequisites
- Node.js 18+ installed
- Git installed
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+)

### Initial Setup
```bash
# Clone and setup
git checkout 001-build-a-very
cd td-web

# Install dependencies
npm install

# Setup database
npm run db:setup

# Start development servers
npm run dev
```

### Development Commands
```bash
# Frontend development server
npm run dev:frontend

# Backend development server  
npm run dev:backend

# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e

# Code quality checks
npm run lint
npm run format
```

## User Journey Testing

### Test Scenario 1: Add New Todo
**Goal**: Verify user can create a new todo item

**Steps**:
1. Open browser to `http://localhost:5173`
2. Verify empty todo list with "No todos yet" message
3. Type "Buy groceries" in the input field
4. Click "Add Todo" button or press Enter
5. Verify todo appears in list with checkbox unchecked
6. Verify input field is cleared

**Expected Result**: 
- Todo "Buy groceries" visible in list
- Todo marked as incomplete (unchecked)
- Input field empty and ready for next todo

### Test Scenario 2: Complete Todo
**Goal**: Verify user can mark todo as complete

**Steps**:
1. Start with existing todo "Buy groceries" (from Scenario 1)
2. Click the checkbox next to "Buy groceries"
3. Verify todo is marked as complete visually
4. Refresh page to verify persistence
5. Verify todo still shows as complete

**Expected Result**:
- Todo text shows strikethrough or different styling
- Checkbox shows as checked
- Status persists after page refresh

### Test Scenario 3: Delete Todo
**Goal**: Verify user can remove unwanted todos

**Steps**:
1. Start with existing todo (completed or incomplete)
2. Click "Delete" button/icon next to the todo
3. Verify todo is removed from list immediately
4. Refresh page to verify deletion persisted
5. If no todos remain, verify "No todos yet" message

**Expected Result**:
- Todo immediately disappears from list
- Deletion persists after page refresh
- UI handles empty state appropriately

### Test Scenario 4: Multiple Todos
**Goal**: Verify application handles multiple todo items

**Steps**:
1. Add multiple todos: "Buy groceries", "Walk the dog", "Finish project"
2. Mark "Walk the dog" as complete
3. Delete "Buy groceries"
4. Add new todo "Call mom"
5. Verify list shows correct todos with correct statuses

**Expected Result**:
- List shows: "Walk the dog" (complete), "Finish project" (incomplete), "Call mom" (incomplete)
- All operations work correctly with multiple items
- List maintains proper ordering (newest first)

### Test Scenario 5: Edge Cases
**Goal**: Verify application handles edge cases gracefully

**Steps**:
1. Try to add empty todo (leave input blank and submit)
2. Add todo with very long text (400+ characters)
3. Try to add todo with special characters and emojis
4. Test rapid clicking on complete/incomplete toggle
5. Test rapid deletion of multiple todos

**Expected Result**:
- Empty todo rejected with error message
- Long text handled appropriately (truncated or rejected)
- Special characters and emojis display correctly
- Rapid operations don't cause UI glitches
- Application remains responsive

## API Testing

### Manual API Tests
```bash
# Test GET /api/v1/todos
curl -X GET http://localhost:3000/api/v1/todos

# Test POST /api/v1/todos
curl -X POST http://localhost:3000/api/v1/todos \
  -H "Content-Type: application/json" \
  -d '{"text":"Test todo"}'

# Test PUT /api/v1/todos/1
curl -X PUT http://localhost:3000/api/v1/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Test DELETE /api/v1/todos/1
curl -X DELETE http://localhost:3000/api/v1/todos/1
```

### Expected API Responses
Each API call should return proper JSON with `success` and `data`/`error` fields as defined in the API contract.

## Performance Validation

### Page Load Performance
1. Open browser developer tools
2. Navigate to `http://localhost:5173`
3. Check Network tab for load time ≤2 seconds
4. Verify no JavaScript errors in console

### Interaction Performance
1. Add 10+ todos quickly
2. Toggle completion status rapidly
3. Delete multiple todos
4. Verify each interaction responds within 500ms

### Mobile Responsiveness
1. Open browser developer tools
2. Switch to mobile device simulation (375px width)
3. Test all functionality on mobile viewport
4. Verify UI elements are properly sized and accessible

## Database Validation

### Data Persistence
```bash
# Check SQLite database directly
sqlite3 backend/database.db ".tables"
sqlite3 backend/database.db "SELECT * FROM todos;"
```

### Schema Validation
```bash
# Verify table structure
sqlite3 backend/database.db ".schema todos"
```

## Troubleshooting

### Common Issues
- **Port conflicts**: Change ports in package.json if 3000/5173 are in use
- **Database locked**: Stop all processes and restart
- **CORS errors**: Verify backend CORS configuration
- **Build failures**: Clear node_modules and reinstall

### Reset Development Environment
```bash
# Full reset
rm -rf node_modules package-lock.json
rm backend/database.db
npm install
npm run db:setup
npm run dev
```

## Success Criteria
- [ ] All user scenarios complete successfully
- [ ] API endpoints respond correctly
- [ ] Page loads within 2 seconds
- [ ] Interactions respond within 500ms
- [ ] Mobile responsiveness verified
- [ ] Data persists across browser sessions
- [ ] No console errors or warnings
- [ ] All tests pass
