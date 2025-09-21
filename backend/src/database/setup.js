import { getDatabase } from './connection.js';

console.log('Setting up SQLite database...');

try {
  const db = getDatabase();
  console.log('✅ Database setup complete');
  console.log('✅ Tables created');
  console.log('✅ Indexes created');
  console.log('✅ Triggers created');
  
  // Test the database
  const testQuery = db.prepare('SELECT COUNT(*) as count FROM todos');
  const result = testQuery.get();
  console.log(`✅ Database test successful - todos table has ${result.count} records`);
} catch (error) {
  console.error('❌ Database setup failed:', error);
  process.exit(1);
}
