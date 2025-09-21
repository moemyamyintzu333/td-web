/**
 * TD-Web API Response Utilities
 * Standardized response formatting for consistent API responses
 * Following TD-Web Constitution v1.0.0 standards
 */

/**
 * Standard success response format
 * @param {Object} data - The response data
 * @param {string} message - Optional success message
 * @param {Object} meta - Optional metadata (pagination, etc.)
 * @returns {Object} Standardized success response
 */
export function createSuccessResponse(data, message = null, meta = null) {
  const response = {
    success: true,
    data,
    timestamp: new Date().toISOString()
  };

  if (message) {
    response.message = message;
  }

  if (meta) {
    response.meta = meta;
  }

  return response;
}

/**
 * Standard error response format
 * @param {string} message - Error message
 * @param {string} code - Error code for client handling
 * @param {Object} details - Additional error details
 * @param {number} status - HTTP status code
 * @returns {Object} Standardized error response
 */
export function createErrorResponse(message, code = 'INTERNAL_ERROR', details = null, status = 500) {
  const response = {
    success: false,
    error: {
      message,
      code,
      timestamp: new Date().toISOString()
    }
  };

  if (details) {
    response.error.details = details;
  }

  // Add HTTP status for reference but don't include in response body
  response._status = status;

  return response;
}

/**
 * Validation error response
 * @param {string} field - The field that failed validation
 * @param {string} message - Validation error message
 * @param {*} value - The invalid value (optional)
 * @returns {Object} Standardized validation error response
 */
export function createValidationErrorResponse(field, message, value = null) {
  const details = { field };
  
  if (value !== null && value !== undefined) {
    details.value = value;
  }

  return createErrorResponse(
    message,
    'VALIDATION_ERROR',
    details,
    400
  );
}

/**
 * Not found error response
 * @param {string} resource - The resource that was not found
 * @param {*} id - The ID that was not found (optional)
 * @returns {Object} Standardized not found error response
 */
export function createNotFoundErrorResponse(resource, id = null) {
  const details = { resource };
  
  if (id !== null && id !== undefined) {
    details.id = id;
  }

  return createErrorResponse(
    `${resource} not found`,
    'NOT_FOUND',
    details,
    404
  );
}

/**
 * Database error response
 * @param {string} operation - The database operation that failed
 * @param {Error} originalError - The original database error (optional)
 * @returns {Object} Standardized database error response
 */
export function createDatabaseErrorResponse(operation, originalError = null) {
  const details = { operation };
  
  if (originalError && process.env.NODE_ENV === 'development') {
    details.originalError = originalError.message;
  }

  return createErrorResponse(
    'Database operation failed',
    'DATABASE_ERROR',
    details,
    500
  );
}

/**
 * Send standardized response
 * @param {Object} res - Express response object
 * @param {Object} responseData - Response data from create*Response functions
 */
export function sendResponse(res, responseData) {
  const status = responseData._status || (responseData.success ? 200 : 500);
  
  // Remove internal status field before sending
  // eslint-disable-next-line no-unused-vars
  const { _status, ...cleanResponse } = responseData;
  
  res.status(status).json(cleanResponse);
}

/**
 * Express middleware to add response utilities to res object
 */
export function responseUtilsMiddleware(req, res, next) {
  // Add utility methods to response object
  res.sendSuccess = (data, message, meta) => {
    const response = createSuccessResponse(data, message, meta);
    sendResponse(res, response);
  };

  res.sendError = (message, code, details, status) => {
    const response = createErrorResponse(message, code, details, status);
    sendResponse(res, response);
  };

  res.sendValidationError = (field, message, value) => {
    const response = createValidationErrorResponse(field, message, value);
    sendResponse(res, response);
  };

  res.sendNotFoundError = (resource, id) => {
    const response = createNotFoundErrorResponse(resource, id);
    sendResponse(res, response);
  };

  res.sendDatabaseError = (operation, originalError) => {
    const response = createDatabaseErrorResponse(operation, originalError);
    sendResponse(res, response);
  };

  next();
}

export default {
  createSuccessResponse,
  createErrorResponse,
  createValidationErrorResponse,
  createNotFoundErrorResponse,
  createDatabaseErrorResponse,
  sendResponse,
  responseUtilsMiddleware
};
