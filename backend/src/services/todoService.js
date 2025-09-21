/**
 * TD-Web Todo Service Layer
 * Business logic and database operations for todo management
 * Following TD-Web Constitution v1.0.0 standards
 */

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database connection
const isTest = process.env.NODE_ENV === 'test';
const dbPath = isTest 
  ? ':memory:' 
  : join(__dirname, '../../database.db');

let db;

try {
  db = new Database(dbPath);
  
  if (!isTest) {
    db.pragma('journal_mode = WAL');
  }
  
  // Create tables if using in-memory database (test environment)
  if (isTest) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
      CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at);
    `);
  }
  
  console.log('Database connected successfully');
} catch (error) {
  console.error('Database connection failed:', error);
  throw error;
}

/**
 * Todo Service class with all CRUD operations
 */
class TodoService {
  /**
   * Get all todos with optional filtering
   * @param {Object} filters - Filter options
   * @param {boolean} filters.completed - Filter by completion status
   * @returns {Array} Array of todo objects
   */
  static getAllTodos(filters = {}) {
    try {
      let query = 'SELECT * FROM todos ORDER BY created_at DESC';
      const params = [];

      if (filters.completed !== undefined) {
        query = 'SELECT * FROM todos WHERE completed = ? ORDER BY created_at DESC';
        params.push(filters.completed ? 1 : 0);
      }

      const stmt = db.prepare(query);
      const rows = stmt.all(params);

      return rows.map(row => ({
        id: row.id,
        text: row.text,
        completed: Boolean(row.completed),
        created_at: row.created_at
      }));
    } catch (error) {
      console.error('Error in getAllTodos:', error);
      throw new Error('Failed to retrieve todos from database');
    }
  }

  /**
   * Get a single todo by ID
   * @param {number} id - Todo ID
   * @returns {Object|null} Todo object or null if not found
   */
  static getTodoById(id) {
    try {
      const stmt = db.prepare('SELECT * FROM todos WHERE id = ?');
      const row = stmt.get(id);

      if (!row) {
        return null;
      }

      return {
        id: row.id,
        text: row.text,
        completed: Boolean(row.completed),
        created_at: row.created_at
      };
    } catch (error) {
      console.error('Error in getTodoById:', error);
      throw new Error('Failed to retrieve todo from database');
    }
  }

  /**
   * Create a new todo
   * @param {Object} todoData - Todo data
   * @param {string} todoData.text - Todo text content
   * @returns {Object} Created todo object
   */
  static createTodo(todoData) {
    try {
      const { text } = todoData;
      const createdAt = new Date().toISOString();

      const stmt = db.prepare(`
        INSERT INTO todos (text, completed, created_at)
        VALUES (?, 0, ?)
      `);

      const result = stmt.run(text.trim(), createdAt);

      if (result.changes === 0) {
        throw new Error('Failed to insert todo');
      }

      return {
        id: result.lastInsertRowid,
        text: text.trim(),
        completed: false,
        created_at: createdAt
      };
    } catch (error) {
      console.error('Error in createTodo:', error);
      throw new Error('Failed to create todo in database');
    }
  }

  /**
   * Update an existing todo
   * @param {number} id - Todo ID
   * @param {Object} updateData - Update data
   * @param {string} [updateData.text] - New todo text
   * @param {boolean} [updateData.completed] - New completion status
   * @returns {Object|null} Updated todo object or null if not found
   */
  static updateTodo(id, updateData) {
    try {
      // First check if todo exists
      const existingTodo = this.getTodoById(id);
      if (!existingTodo) {
        return null;
      }

      const { text, completed } = updateData;
      const updates = [];
      const params = [];

      if (text !== undefined) {
        updates.push('text = ?');
        params.push(text.trim());
      }

      if (completed !== undefined) {
        updates.push('completed = ?');
        params.push(completed ? 1 : 0);
      }

      if (updates.length === 0) {
        // No updates provided, return existing todo
        return existingTodo;
      }

      const query = `UPDATE todos SET ${updates.join(', ')} WHERE id = ?`;
      params.push(id);

      const stmt = db.prepare(query);
      const result = stmt.run(params);

      if (result.changes === 0) {
        return null;
      }

      // Return updated todo
      return this.getTodoById(id);
    } catch (error) {
      console.error('Error in updateTodo:', error);
      throw new Error('Failed to update todo in database');
    }
  }

  /**
   * Delete a todo
   * @param {number} id - Todo ID
   * @returns {boolean} True if deleted, false if not found
   */
  static deleteTodo(id) {
    try {
      const stmt = db.prepare('DELETE FROM todos WHERE id = ?');
      const result = stmt.run(id);

      return result.changes > 0;
    } catch (error) {
      console.error('Error in deleteTodo:', error);
      throw new Error('Failed to delete todo from database');
    }
  }

  /**
   * Get database statistics
   * @returns {Object} Database stats
   */
  static getStats() {
    try {
      const totalStmt = db.prepare('SELECT COUNT(*) as total FROM todos');
      const completedStmt = db.prepare('SELECT COUNT(*) as completed FROM todos WHERE completed = 1');

      const total = totalStmt.get().total;
      const completed = completedStmt.get().completed;

      return {
        total,
        completed,
        pending: total - completed
      };
    } catch (error) {
      console.error('Error in getStats:', error);
      throw new Error('Failed to retrieve database statistics');
    }
  }

  /**
   * Close database connection
   */
  static close() {
    if (db) {
      db.close();
      console.log('Database connection closed');
    }
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  TodoService.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  TodoService.close();
  process.exit(0);
});

export default TodoService;
