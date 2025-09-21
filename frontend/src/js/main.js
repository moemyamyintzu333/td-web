/**
 * TD-Web Frontend Main Application
 * Vanilla JavaScript todo list application
 * Following TD-Web Constitution v1.0.0 standards
 */

import TodoAPIService from '../services/todoAPI.js';

/**
 * Main Todo Application Class
 */
class TodoApp {
  constructor() {
    this.todos = [];
    this.isLoading = false;

    // DOM elements
    this.elements = {
      todoForm: document.getElementById('add-todo-form'),
      todoInput: document.getElementById('todo-input'),
      todoList: document.getElementById('todo-list'),
      emptyMessage: document.getElementById('empty-message'),
      errorMessage: document.getElementById('error-message'),
      loading: document.getElementById('loading'),
      totalCount: document.getElementById('total-count'),
      completedCount: document.getElementById('completed-count'),
      pendingCount: document.getElementById('pending-count'),
    };

    // Ensure todo list is visible from start
    this.elements.todoList.classList.remove('hidden');

    this.init();
  }

  /**
   * Initialize the application
   */
  async init() {
    this.bindEvents();
    await this.loadTodos();
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Form submission
    this.elements.todoForm.addEventListener(
      'submit',
      this.handleAddTodo.bind(this)
    );

    // Enter key support
    this.elements.todoInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.handleAddTodo(event);
      }
    });

    // Input validation on typing
    this.elements.todoInput.addEventListener(
      'input',
      this.clearError.bind(this)
    );
  }

  /**
   * Load todos from the API
   */
  async loadTodos() {
    try {
      this.setLoading(true);
      this.clearError();

      this.todos = await TodoAPIService.getTodos();
      this.renderTodos();
      this.updateStats();
    } catch (error) {
      this.showError('Failed to load todos: ' + error.message);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Handle adding a new todo
   */
  async handleAddTodo(event) {
    event.preventDefault();

    const text = this.elements.todoInput.value.trim();

    if (!text) {
      this.showError('Please enter a todo item');
      this.elements.todoInput.focus();
      return;
    }

    if (text.length > 500) {
      this.showError('Todo text must be 500 characters or less');
      return;
    }

    try {
      const newTodo = await TodoAPIService.createTodo(text);

      // Add to local state
      this.todos.push(newTodo);

      // Clear form
      this.elements.todoInput.value = '';

      // Re-render
      this.renderTodos();
      this.updateStats();
    } catch (error) {
      this.showError('Failed to add todo: ' + error.message);
    }
  }

  /**
   * Handle toggling todo completion
   */
  async handleToggleTodo(id, completed) {
    try {
      const updatedTodo = await TodoAPIService.toggleTodo(id, completed);

      // Update local state
      const index = this.todos.findIndex((todo) => todo.id === id);
      if (index !== -1) {
        this.todos[index] = updatedTodo;
      }

      this.renderTodos();
      this.updateStats();
    } catch (error) {
      this.showError('Failed to update todo: ' + error.message);
      // Reload to get correct state
      await this.loadTodos();
    }
  }

  /**
   * Handle deleting a todo
   */
  async handleDeleteTodo(id) {
    if (!confirm('Are you sure you want to delete this todo?')) {
      return;
    }

    try {
      await TodoAPIService.deleteTodo(id);

      // Remove from local state
      this.todos = this.todos.filter((todo) => todo.id !== id);

      this.renderTodos();
      this.updateStats();
    } catch (error) {
      this.showError('Failed to delete todo: ' + error.message);
    }
  }

  /**
   * Render todos to the DOM
   */
  renderTodos() {
    const todoList = this.elements.todoList;
    const emptyMessage = this.elements.emptyMessage;

    // Always make todo list visible
    todoList.classList.remove('hidden');

    // Clear existing content
    todoList.innerHTML = '';

    if (this.todos.length === 0) {
      emptyMessage.classList.remove('hidden');
      return;
    }

    emptyMessage.classList.add('hidden');

    // Render each todo
    this.todos.forEach((todo) => {
      const todoElement = this.createTodoElement(todo);
      todoList.appendChild(todoElement);
    });
  }

  /**
   * Create a todo DOM element
   */
  createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.setAttribute('data-testid', 'todo-item');
    li.setAttribute('data-todo-id', todo.id);

    li.innerHTML = `
      <input 
        type="checkbox" 
        class="todo-checkbox" 
        data-testid="todo-checkbox"
        ${todo.completed ? 'checked' : ''}
      >
      <span 
        class="todo-text ${todo.completed ? 'completed' : ''}" 
        data-testid="todo-text"
      >${this.escapeHtml(todo.text)}</span>
      <button 
        type="button" 
        class="todo-delete" 
        data-testid="todo-delete"
        aria-label="Delete todo"
      >
        ✕
      </button>
    `;

    // Add event listeners
    const checkbox = li.querySelector('.todo-checkbox');
    const deleteButton = li.querySelector('.todo-delete');

    checkbox.addEventListener('change', () => {
      this.handleToggleTodo(todo.id, checkbox.checked);
    });

    deleteButton.addEventListener('click', () => {
      this.handleDeleteTodo(todo.id);
    });

    return li;
  }

  /**
   * Update statistics display
   */
  updateStats() {
    const total = this.todos.length;
    const completed = this.todos.filter((todo) => todo.completed).length;
    const pending = total - completed;

    this.elements.totalCount.textContent = `${total} todo${total !== 1 ? 's' : ''}`;
    this.elements.completedCount.textContent = `${completed} completed`;
    this.elements.pendingCount.textContent = `${pending} pending`;
  }

  /**
   * Set loading state
   */
  setLoading(loading) {
    this.isLoading = loading;
    this.elements.loading.classList.toggle('hidden', !loading);
  }

  /**
   * Show error message
   */
  showError(message) {
    this.elements.errorMessage.textContent = message;
    this.elements.errorMessage.classList.remove('hidden');

    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.clearError();
    }, 5000);
  }

  /**
   * Clear error message
   */
  clearError() {
    this.elements.errorMessage.textContent = '';
    this.elements.errorMessage.classList.add('hidden');
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new TodoApp();
});