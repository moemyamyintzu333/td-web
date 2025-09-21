# Tasks: Simple Todo-List Web Application

*## Pha- [x] T003 [P] Initialize frontend Vite project with minimal dependencies in frontend/
- [x] T004 [P] Configure ESLint and Prettier for both frontend and backend
- [x] T005 Setup SQLite database schema and migrations in backend/src/database/3.1: Setup
- [x] T001 Create web application project structure per implementation plan
- [x] T002 [P] Initialize backend Node.js project with Express and SQLite3 dependencies in backend/
- [x] T003 [P] Initialize frontend Vite project with minimal dependencies in frontend/ut**: Design documents from `/Users/moemyamyintzu/td-web/specs/001-build-a-very/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → ✅ Found: JavaScript ES2020+ + Vite 4.x, Node.js + Express + SQLite3
   → ✅ Extract: Web app structure (frontend/backend separation)
2. Load optional design documents:
   → ✅ data-model.md: Todo entity → model tasks
   → ✅ contracts/api-todos.md: 4 endpoints → contract test tasks
   → ✅ research.md: Technology decisions → setup tasks
   → ✅ quickstart.md: 5 user scenarios → integration test tasks
3. Generate tasks by category:
   → Setup: Vite config, Node.js project, SQLite database, ESLint
   → Tests: 4 contract tests, 5 integration tests
   → Core: Todo model, TodoService, API endpoints, frontend components
   → Integration: CORS, error handling, database connection
   → Polish: unit tests, performance validation, code quality
4. Apply task rules:
   → Frontend and backend files = can be parallel [P]
   → API endpoints in same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → ✅ All 4 API endpoints have contract tests
   → ✅ Todo entity has model task
   → ✅ All 5 user scenarios have integration tests
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Web app**: `backend/src/`, `frontend/src/`
- **Tests**: `backend/tests/`, `frontend/tests/`
- Paths adjusted for web application structure per plan.md

## Phase 3.1: Setup
- [x] T001 Create web application project structure per implementation plan
- [ ] T002 [P] Initialize backend Node.js project with Express and SQLite3 dependencies in backend/
- [ ] T003 [P] Initialize frontend Vite project with minimal dependencies in frontend/
- [ ] T004 [P] Configure ESLint and Prettier for both frontend and backend
- [ ] T005 Setup SQLite database schema and migrations in backend/src/database/

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### Contract Tests (API Endpoints)
- [ ] T006 [P] Contract test GET /api/v1/todos in backend/tests/contract/test_todos_get.js
- [ ] T007 [P] Contract test POST /api/v1/todos in backend/tests/contract/test_todos_post.js
- [ ] T008 [P] Contract test PUT /api/v1/todos/:id in backend/tests/contract/test_todos_put.js
- [ ] T009 [P] Contract test DELETE /api/v1/todos/:id in backend/tests/contract/test_todos_delete.js

### Integration Tests (User Scenarios)
- [ ] T010 [P] Integration test "Add New Todo" scenario in frontend/tests/integration/test_add_todo.spec.js
- [ ] T011 [P] Integration test "Complete Todo" scenario in frontend/tests/integration/test_complete_todo.spec.js
- [ ] T012 [P] Integration test "Delete Todo" scenario in frontend/tests/integration/test_delete_todo.spec.js
- [ ] T013 [P] Integration test "Multiple Todos" scenario in frontend/tests/integration/test_multiple_todos.spec.js
- [ ] T014 [P] Integration test "Edge Cases" scenario in frontend/tests/integration/test_edge_cases.spec.js

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Backend Implementation
- [ ] T015 [P] Todo model with validation in backend/src/models/Todo.js
- [ ] T016 [P] TodoService with CRUD operations in backend/src/services/TodoService.js
- [ ] T017 Database connection and query utilities in backend/src/database/connection.js
- [ ] T018 GET /api/v1/todos endpoint in backend/src/routes/todos.js
- [ ] T019 POST /api/v1/todos endpoint in backend/src/routes/todos.js
- [ ] T020 PUT /api/v1/todos/:id endpoint in backend/src/routes/todos.js
- [ ] T021 DELETE /api/v1/todos/:id endpoint in backend/src/routes/todos.js
- [ ] T022 Input validation middleware in backend/src/middleware/validation.js
- [ ] T023 Error handling middleware in backend/src/middleware/errorHandler.js

### Frontend Implementation
- [ ] T024 [P] TodoApp main component in frontend/src/components/TodoApp.js
- [ ] T025 [P] TodoItem component with checkbox and delete in frontend/src/components/TodoItem.js
- [ ] T026 [P] TodoForm component for adding todos in frontend/src/components/TodoForm.js
- [ ] T027 [P] TodoList component for displaying todos in frontend/src/components/TodoList.js
- [ ] T028 [P] API client service for backend communication in frontend/src/services/api.js
- [ ] T029 [P] Main application CSS styles in frontend/src/styles/main.css
- [ ] T030 HTML template and app initialization in frontend/index.html and frontend/src/main.js

## Phase 3.4: Integration
- [ ] T031 CORS configuration for frontend-backend communication in backend/src/middleware/cors.js
- [ ] T032 Express server setup with routes and middleware in backend/src/server.js
- [ ] T033 Frontend build configuration and dev server setup in frontend/vite.config.js
- [ ] T034 Environment configuration for development and production in both projects
- [ ] T035 Request/response logging in backend/src/middleware/logger.js

## Phase 3.5: Polish
- [ ] T036 [P] Unit tests for Todo model validation in backend/tests/unit/test_todo_model.js
- [ ] T037 [P] Unit tests for TodoService CRUD operations in backend/tests/unit/test_todo_service.js
- [ ] T038 [P] Unit tests for frontend components in frontend/tests/unit/
- [ ] T039 [P] Performance tests (≤2s page load, ≤500ms API response) in frontend/tests/performance/
- [ ] T040 [P] Code quality checks and static analysis setup
- [ ] T041 [P] UI accessibility and responsive design validation
- [ ] T042 [P] Update API documentation in docs/api.md
- [ ] T043 Remove code duplication and refactor
- [ ] T044 Run quickstart manual testing scenarios

## Dependencies

### Setup Dependencies
- T001 → T002, T003 (project structure before package init)
- T002, T003 → T004 (projects before linting setup)
- T005 → T015, T016, T017 (database before models)

### TDD Dependencies
- Contract Tests (T006-T009) → API Implementation (T018-T021)
- Integration Tests (T010-T014) → Frontend Implementation (T024-T030)
- T015 (Todo model) → T016 (TodoService)
- T016 (TodoService) → T018-T021 (API endpoints)
- T017 (database connection) → T016 (TodoService)

### Integration Dependencies
- T018-T021 (API endpoints) → T031, T032 (CORS, server)
- T024-T030 (frontend components) → T033 (build config)
- Backend implementation → T031, T035 (integration middleware)

### Polish Dependencies
- All implementation → T036-T044 (polish tasks)

## Parallel Execution Examples

### Setup Phase (can run together)
```bash
# T002 and T003 can run in parallel
Task: "Initialize backend Node.js project with Express and SQLite3 dependencies in backend/"
Task: "Initialize frontend Vite project with minimal dependencies in frontend/"
```

### Contract Tests Phase (can run together)
```bash
# T006-T009 can run in parallel
Task: "Contract test GET /api/v1/todos in backend/tests/contract/test_todos_get.js"
Task: "Contract test POST /api/v1/todos in backend/tests/contract/test_todos_post.js"
Task: "Contract test PUT /api/v1/todos/:id in backend/tests/contract/test_todos_put.js"
Task: "Contract test DELETE /api/v1/todos/:id in backend/tests/contract/test_todos_delete.js"
```

### Integration Tests Phase (can run together)
```bash
# T010-T014 can run in parallel
Task: "Integration test 'Add New Todo' scenario in frontend/tests/integration/test_add_todo.spec.js"
Task: "Integration test 'Complete Todo' scenario in frontend/tests/integration/test_complete_todo.spec.js"
Task: "Integration test 'Delete Todo' scenario in frontend/tests/integration/test_delete_todo.spec.js"
```

### Core Implementation Phase (frontend/backend parallel)
```bash
# Backend and frontend components can run in parallel
Task: "Todo model with validation in backend/src/models/Todo.js"
Task: "TodoApp main component in frontend/src/components/TodoApp.js"
Task: "TodoItem component with checkbox and delete in frontend/src/components/TodoItem.js"
```

## Notes
- [P] tasks = different files/projects, no dependencies
- Verify tests fail before implementing (TDD requirement)
- Commit after each task completion
- Backend and frontend can largely be developed in parallel
- API endpoints in same file (todos.js) must be sequential
- All tests must pass before moving to next phase

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts (api-todos.md)**:
   - 4 endpoints → 4 contract test tasks [P] (different test files)
   - 4 endpoints → 4 implementation tasks (same route file, sequential)
   
2. **From Data Model (data-model.md)**:
   - Todo entity → model creation task [P]
   - CRUD operations → service layer task [P]
   
3. **From User Stories (quickstart.md)**:
   - 5 scenarios → 5 integration test tasks [P]
   - Frontend interactions → component tasks [P]

4. **Ordering**:
   - Setup → Tests → Models → Services → Endpoints → Integration → Polish
   - Dependencies block parallel execution within phases

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All 4 API contracts have corresponding tests (T006-T009)
- [x] Todo entity has model task (T015)
- [x] All 5 user scenarios have integration tests (T010-T014)
- [x] All tests come before implementation (T006-T014 before T015-T030)
- [x] Parallel tasks truly independent (different files/projects)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task (todos.js endpoints sequential)
