/**
 * Test setup for TD-Web Backend
 * Configures test environment following TD-Web Constitution v1.0.0
 */

// Set test environment
process.env.NODE_ENV = 'test';

console.log('Setting up test environment...');
console.log('Using in-memory SQLite database for tests');
