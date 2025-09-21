/**
 * TD-Web Frontend Integration Tests
 * Tests user interaction scenarios for the todo list application
 * Following TD-Web Constitution v1.0.0 testing standards
 */

import { test, expect } from '@playwright/test';

// Test configuration
const BASE_URL = 'http://localhost:5173'; // Vite dev server default
const API_BASE_URL = 'http://localhost:3000'; // Express server default

test.describe('Todo List Application Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    console.log('Setting up integration test environment...');

    // Navigate to the todo app
    await page.goto(BASE_URL);

    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test.describe('Todo Display Functionality', () => {
    test('should display empty todo list initially', async ({ page }) => {
      // Check for the todo list container
      const todoList = page.locator('[data-testid="todo-list"]');
      await expect(todoList).toBeVisible();

      // Check for empty state message
      const emptyMessage = page.locator('[data-testid="empty-message"]');
      await expect(emptyMessage).toBeVisible();
      await expect(emptyMessage).toHaveText(/no todos/i);
    });

    test('should display todos when they exist', async ({ page }) => {
      // Mock API response with existing todos
      await page.route(`${API_BASE_URL}/api/v1/todos`, async (route) => {
        const json = [
          {
            id: 1,
            text: 'Test todo 1',
            completed: false,
            created_at: '2024-01-01T00:00:00Z',
          },
          {
            id: 2,
            text: 'Test todo 2',
            completed: true,
            created_at: '2024-01-01T01:00:00Z',
          },
        ];
        await route.fulfill({ json });
      });

      // Reload page to trigger API call
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Check that todos are displayed
      const todoItems = page.locator('[data-testid="todo-item"]');
      await expect(todoItems).toHaveCount(2);

      // Check todo content
      await expect(todoItems.first()).toContainText('Test todo 1');
      await expect(todoItems.last()).toContainText('Test todo 2');

      // Check completed status
      const firstTodo = todoItems.first();
      const secondTodo = todoItems.last();

      await expect(
        firstTodo.locator('[data-testid="todo-checkbox"]')
      ).not.toBeChecked();
      await expect(
        secondTodo.locator('[data-testid="todo-checkbox"]')
      ).toBeChecked();
    });

    test('should show proper todo formatting and structure', async ({
      page,
    }) => {
      // Mock API response
      await page.route(`${API_BASE_URL}/api/v1/todos`, async (route) => {
        const json = [
          {
            id: 1,
            text: 'Sample todo item',
            completed: false,
            created_at: '2024-01-01T00:00:00Z',
          },
        ];
        await route.fulfill({ json });
      });

      await page.reload();
      await page.waitForLoadState('networkidle');

      const todoItem = page.locator('[data-testid="todo-item"]').first();

      // Check that todo has required elements
      await expect(
        todoItem.locator('[data-testid="todo-checkbox"]')
      ).toBeVisible();
      await expect(todoItem.locator('[data-testid="todo-text"]')).toBeVisible();
      await expect(
        todoItem.locator('[data-testid="todo-delete"]')
      ).toBeVisible();

      // Check accessibility attributes
      await expect(
        todoItem.locator('[data-testid="todo-checkbox"]')
      ).toHaveAttribute('type', 'checkbox');
      await expect(
        todoItem.locator('[data-testid="todo-delete"]')
      ).toHaveAttribute('type', 'button');
    });
  });

  test.describe('Todo Creation Workflow', () => {
    test('should allow adding a new todo', async ({ page }) => {
      // Mock POST response
      let postRequestMade = false;
      await page.route(`${API_BASE_URL}/api/v1/todos`, async (route) => {
        if (route.request().method() === 'POST') {
          postRequestMade = true;
          const requestData = await route.request().postDataJSON();
          expect(requestData.text).toBe('New test todo');

          const json = {
            id: 1,
            text: 'New test todo',
            completed: false,
            created_at: new Date().toISOString(),
          };
          await route.fulfill({ status: 201, json });
        } else {
          // GET request
          const json = [];
          await route.fulfill({ json });
        }
      });

      // Find and fill the input field
      const todoInput = page.locator('[data-testid="todo-input"]');
      await expect(todoInput).toBeVisible();
      await todoInput.fill('New test todo');

      // Submit the form
      const addButton = page.locator('[data-testid="add-todo-button"]');
      await addButton.click();

      // Verify POST request was made
      expect(postRequestMade).toBe(true);

      // Verify input is cleared after submission
      await expect(todoInput).toHaveValue('');
    });

    test('should not allow empty todos', async ({ page }) => {
      const todoInput = page.locator('[data-testid="todo-input"]');
      const addButton = page.locator('[data-testid="add-todo-button"]');

      // Try to submit empty todo
      await addButton.click();

      // Input should still be focused and empty
      await expect(todoInput).toBeFocused();
      await expect(todoInput).toHaveValue('');

      // Try with whitespace only
      await todoInput.fill('   ');
      await addButton.click();

      // Should be trimmed and rejected
      await expect(todoInput).toBeFocused();
    });

    test('should handle long todo text appropriately', async ({ page }) => {
      const longText = 'a'.repeat(501); // Exceeds 500 character limit

      const todoInput = page.locator('[data-testid="todo-input"]');
      await todoInput.fill(longText);

      // Should be truncated or show validation error
      const addButton = page.locator('[data-testid="add-todo-button"]');
      await addButton.click();

      // Expect validation message or truncation
      const errorMessage = page.locator('[data-testid="error-message"]');
      await expect(errorMessage).toBeVisible();
    });

    test('should support Enter key for adding todos', async ({ page }) => {
      // Mock API response
      await page.route(`${API_BASE_URL}/api/v1/todos`, async (route) => {
        if (route.request().method() === 'POST') {
          const json = {
            id: 1,
            text: 'Todo via Enter key',
            completed: false,
            created_at: new Date().toISOString(),
          };
          await route.fulfill({ status: 201, json });
        } else {
          await route.fulfill({ json: [] });
        }
      });

      const todoInput = page.locator('[data-testid="todo-input"]');
      await todoInput.fill('Todo via Enter key');
      await todoInput.press('Enter');

      // Verify input is cleared
      await expect(todoInput).toHaveValue('');
    });
  });

  test.describe('Todo Status Toggle', () => {
    test('should toggle todo completion status', async ({ page }) => {
      // Mock initial GET response
      await page.route(`${API_BASE_URL}/api/v1/todos`, async (route) => {
        if (route.request().method() === 'GET') {
          const json = [
            {
              id: 1,
              text: 'Test todo',
              completed: false,
              created_at: '2024-01-01T00:00:00Z',
            },
          ];
          await route.fulfill({ json });
        }
      });

      // Mock PUT response for toggle
      let putRequestMade = false;
      await page.route(`${API_BASE_URL}/api/v1/todos/1`, async (route) => {
        if (route.request().method() === 'PUT') {
          putRequestMade = true;
          const requestData = await route.request().postDataJSON();
          expect(requestData.completed).toBe(true);

          const json = {
            id: 1,
            text: 'Test todo',
            completed: true,
            created_at: '2024-01-01T00:00:00Z',
          };
          await route.fulfill({ json });
        }
      });

      await page.reload();
      await page.waitForLoadState('networkidle');

      // Click the checkbox to toggle completion
      const checkbox = page.locator('[data-testid="todo-checkbox"]').first();
      await checkbox.click();

      // Verify PUT request was made
      expect(putRequestMade).toBe(true);

      // Verify visual state change
      await expect(checkbox).toBeChecked();
    });

    test('should apply completed styling to finished todos', async ({
      page,
    }) => {
      // Mock API response with completed todo
      await page.route(`${API_BASE_URL}/api/v1/todos`, async (route) => {
        const json = [
          {
            id: 1,
            text: 'Completed todo',
            completed: true,
            created_at: '2024-01-01T00:00:00Z',
          },
        ];
        await route.fulfill({ json });
      });

      await page.reload();
      await page.waitForLoadState('networkidle');

      const todoItem = page.locator('[data-testid="todo-item"]').first();
      const todoText = todoItem.locator('[data-testid="todo-text"]');

      // Check that completed styling is applied
      await expect(todoText).toHaveClass(/completed/);
      await expect(
        todoItem.locator('[data-testid="todo-checkbox"]')
      ).toBeChecked();
    });

    test('should handle toggle errors gracefully', async ({ page }) => {
      // Mock initial GET response
      await page.route(`${API_BASE_URL}/api/v1/todos`, async (route) => {
        if (route.request().method() === 'GET') {
          const json = [
            {
              id: 1,
              text: 'Test todo',
              completed: false,
              created_at: '2024-01-01T00:00:00Z',
            },
          ];
          await route.fulfill({ json });
        }
      });

      // Mock PUT error response
      await page.route(`${API_BASE_URL}/api/v1/todos/1`, async (route) => {
        if (route.request().method() === 'PUT') {
          await route.fulfill({ status: 500, json: { error: 'Server error' } });
        }
      });

      await page.reload();
      await page.waitForLoadState('networkidle');

      const checkbox = page.locator('[data-testid="todo-checkbox"]').first();
      await checkbox.click();

      // Should show error message and revert checkbox state
      const errorMessage = page.locator('[data-testid="error-message"]');
      await expect(errorMessage).toBeVisible();
      await expect(checkbox).not.toBeChecked();
    });
  });

  test.describe('Todo Deletion Workflow', () => {
    test('should delete a todo when delete button is clicked', async ({
      page,
    }) => {
      // Mock initial GET response
      await page.route(`${API_BASE_URL}/api/v1/todos`, async (route) => {
        if (route.request().method() === 'GET') {
          const json = [
            {
              id: 1,
              text: 'Todo to delete',
              completed: false,
              created_at: '2024-01-01T00:00:00Z',
            },
          ];
          await route.fulfill({ json });
        }
      });

      // Mock DELETE response
      let deleteRequestMade = false;
      await page.route(`${API_BASE_URL}/api/v1/todos/1`, async (route) => {
        if (route.request().method() === 'DELETE') {
          deleteRequestMade = true;
          await route.fulfill({
            status: 200,
            json: { message: 'Todo deleted' },
          });
        }
      });

      await page.reload();
      await page.waitForLoadState('networkidle');

      // Click delete button
      const deleteButton = page.locator('[data-testid="todo-delete"]').first();
      await deleteButton.click();

      // Verify DELETE request was made
      expect(deleteRequestMade).toBe(true);

      // Todo should be removed from DOM
      const todoItems = page.locator('[data-testid="todo-item"]');
      await expect(todoItems).toHaveCount(0);
    });

    test('should show confirmation dialog for deletion', async ({ page }) => {
      // Mock initial todos
      await page.route(`${API_BASE_URL}/api/v1/todos`, async (route) => {
        const json = [
          {
            id: 1,
            text: 'Important todo',
            completed: false,
            created_at: '2024-01-01T00:00:00Z',
          },
        ];
        await route.fulfill({ json });
      });

      await page.reload();
      await page.waitForLoadState('networkidle');

      const deleteButton = page.locator('[data-testid="todo-delete"]').first();

      // Set up dialog handler
      page.on('dialog', async (dialog) => {
        expect(dialog.type()).toBe('confirm');
        expect(dialog.message()).toContain('delete');
        await dialog.dismiss(); // Cancel deletion
      });

      await deleteButton.click();

      // Todo should still be present after canceling
      const todoItems = page.locator('[data-testid="todo-item"]');
      await expect(todoItems).toHaveCount(1);
    });

    test('should handle deletion errors gracefully', async ({ page }) => {
      // Mock initial GET response
      await page.route(`${API_BASE_URL}/api/v1/todos`, async (route) => {
        if (route.request().method() === 'GET') {
          const json = [
            {
              id: 1,
              text: 'Test todo',
              completed: false,
              created_at: '2024-01-01T00:00:00Z',
            },
          ];
          await route.fulfill({ json });
        }
      });

      // Mock DELETE error response
      await page.route(`${API_BASE_URL}/api/v1/todos/1`, async (route) => {
        if (route.request().method() === 'DELETE') {
          await route.fulfill({
            status: 404,
            json: { error: 'Todo not found' },
          });
        }
      });

      await page.reload();
      await page.waitForLoadState('networkidle');

      // Handle confirmation dialog
      page.on('dialog', async (dialog) => {
        await dialog.accept();
      });

      const deleteButton = page.locator('[data-testid="todo-delete"]').first();
      await deleteButton.click();

      // Should show error message and keep todo in list
      const errorMessage = page.locator('[data-testid="error-message"]');
      await expect(errorMessage).toBeVisible();

      const todoItems = page.locator('[data-testid="todo-item"]');
      await expect(todoItems).toHaveCount(1);
    });
  });

  test.describe('Application Performance and UX', () => {
    test('should load within performance requirements', async ({ page }) => {
      const startTime = Date.now();

      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');

      const loadTime = Date.now() - startTime;

      // TD-Web Constitution: Page load ≤ 2000ms
      expect(loadTime).toBeLessThan(2000);
    });

    test('should be responsive on mobile viewports', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');

      // Check that elements are properly sized for mobile
      const todoInput = page.locator('[data-testid="todo-input"]');
      const addButton = page.locator('[data-testid="add-todo-button"]');

      await expect(todoInput).toBeVisible();
      await expect(addButton).toBeVisible();

      // Elements should not overflow viewport
      const inputBox = await todoInput.boundingBox();
      const buttonBox = await addButton.boundingBox();

      expect(inputBox.x + inputBox.width).toBeLessThanOrEqual(375);
      expect(buttonBox.x + buttonBox.width).toBeLessThanOrEqual(375);
    });

    test('should have proper accessibility attributes', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');

      // Check for proper ARIA labels and semantic HTML
      const todoInput = page.locator('[data-testid="todo-input"]');
      const addButton = page.locator('[data-testid="add-todo-button"]');

      await expect(todoInput).toHaveAttribute('aria-label');
      await expect(addButton).toHaveAttribute('aria-label');

      // Check for proper heading structure
      const mainHeading = page.locator('h1');
      await expect(mainHeading).toBeVisible();
    });
  });
});
