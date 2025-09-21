/**
 * TD-Web Frontend API Service
 * Handles communication with the backend API
 * Following TD-Web Constitution v1.0.0 standards
 */

const API_BASE_URL = 'http://localhost:3000';

class TodoAPIService {
  /**
   * Get all todos
   */
  static async getTodos() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/todos`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw new Error('Failed to fetch todos');
    }
  }

  /**
   * Create a new todo
   */
  static async createTodo(text) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw new Error('Failed to create todo');
    }
  }

  /**
   * Toggle todo completion status
   */
  static async toggleTodo(id, completed) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error toggling todo:', error);
      throw new Error('Failed to update todo');
    }
  }

  /**
   * Delete a todo
   */
  static async deleteTodo(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw new Error('Failed to delete todo');
    }
  }
}

export default TodoAPIService;