# TD-Web Todo List Application

A full-stack todo list application built following the TD-Web Constitution v1.0.0 standards. This project demonstrates Test-Driven Development (TDD) with a modern tech stack including Express.js backend, SQLite database, and vanilla JavaScript frontend.

## 🏗️ Architecture

- **Backend**: Express.js with SQLite database
- **Frontend**: Vite + Vanilla JavaScript
- **Testing**: Vitest (backend) + Playwright (frontend integration)
- **Development**: TDD approach with comprehensive test coverage

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/moemyamyintzu333/td-web.git
cd td-web
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Run backend tests (optional)
npm test

# Start the backend server
npm start
```

The backend server will start on `http://localhost:3000`

### 3. Frontend Setup

Open a new terminal window/tab:

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/health (health check)

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage     # Run tests with coverage report
```

### Frontend Tests

```bash
cd frontend
npm run test:integration   # Run Playwright integration tests
npm run test:unit         # Run unit tests (if available)
```

## 📁 Project Structure

```
td-web/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── services/       # Business logic layer
│   │   ├── database/       # Database connection & setup
│   │   └── server.js       # Main server file
│   ├── tests/              # Backend test files
│   ├── database.db         # SQLite database file
│   └── package.json
├── frontend/               # Vite frontend application
│   ├── src/
│   │   ├── js/            # JavaScript application code
│   │   ├── styles/        # CSS stylesheets
│   │   └── services/      # API service layer
│   ├── tests/             # Frontend test files
│   ├── index.html         # Main HTML file
│   └── package.json
├── docs/                  # Documentation
├── specs/                 # Project specifications
└── README.md
```

## 🔧 Development Commands

### Backend Development

```bash
cd backend

# Development with auto-restart
npm run dev

# Run specific test file
npm test -- todoService.test.js

# Generate test coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
```

### Frontend Development

```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run integration tests
npm run test:integration

# Run tests in headed mode (with browser UI)
npm run test:integration -- --headed

# Lint code
npm run lint

# Format code
npm run format
```

## 🌐 API Endpoints

The backend provides a RESTful API with the following endpoints:

### Todos
- `GET /api/v1/todos` - Get all todos
- `POST /api/v1/todos` - Create a new todo
- `PUT /api/v1/todos/:id` - Update a todo
- `DELETE /api/v1/todos/:id` - Delete a todo

### Health Check
- `GET /health` - Server health check

### Example API Usage

```bash
# Get all todos
curl http://localhost:3000/api/v1/todos

# Create a todo
curl -X POST http://localhost:3000/api/v1/todos \
  -H "Content-Type: application/json" \
  -d '{"text":"Buy groceries"}'

# Update a todo
curl -X PUT http://localhost:3000/api/v1/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Delete a todo
curl -X DELETE http://localhost:3000/api/v1/todos/1
```

## 🎯 Features

- ✅ Create new todos
- ✅ Mark todos as complete/incomplete
- ✅ Delete todos
- ✅ View todo statistics (total, completed, pending)
- ✅ Responsive design
- ✅ Real-time updates
- ✅ Input validation
- ✅ Error handling
- ✅ Accessible UI components

## 🐛 Troubleshooting

### Backend Issues

**Port 3000 already in use:**
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

**Database issues:**
```bash
# Remove database file to reset
rm backend/database.db
# Restart backend server to recreate database
```

### Frontend Issues

**Port 5173 already in use:**
```bash
# The frontend will automatically use the next available port
# Or manually specify a different port:
npm run dev -- --port 3001
```

**CORS errors:**
- Ensure the backend server is running on port 3000
- Check that the API_BASE_URL in frontend matches the backend URL

### Test Issues

**Integration tests failing:**
- Ensure both frontend and backend servers are running
- Check that ports 3000 and 5173 are available
- Clear browser cache if needed

## 📖 Development Standards

This project follows the TD-Web Constitution v1.0.0 which includes:

- Test-Driven Development (TDD) approach
- Comprehensive error handling
- Standardized API response formats
- Clean code principles
- Proper documentation
- Accessibility standards

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow TDD approach: write tests first, then implementation
4. Ensure all tests pass (`npm test` in both backend and frontend)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License 111111

This project is developed as part of the TD-Web Constitution v1.0.0 standards demonstration.

## 🔗 Linkssdf

- [TD-Web Constitution v1.0.0](./docs/TD-Web-Constitution-v1.0.0.md)
- [Project Specifications](./specs/)
- [Development Reflection](./reflection.md)

---

**Happy coding! 🚀**

