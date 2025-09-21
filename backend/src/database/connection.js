import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../database.db');

let db = null;

export function getDatabase() {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    initializeSchema();
  }
  return db;
}

function initializeSchema() {
  const createTodosTable = `
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL CHECK(length(text) > 0 AND length(text) <= 500),
      completed BOOLEAN DEFAULT 0 CHECK(completed IN (0, 1)),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createIndexes = [
    'CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed)',
    'CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at DESC)'
  ];

  const createTrigger = `
    CREATE TRIGGER IF NOT EXISTS update_todos_updated_at 
      AFTER UPDATE ON todos
    BEGIN
      UPDATE todos SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END
  `;

  db.exec(createTodosTable);
  createIndexes.forEach(index => db.exec(index));
  db.exec(createTrigger);
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

export default { getDatabase, closeDatabase };
