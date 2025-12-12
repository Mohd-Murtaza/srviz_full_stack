// Success response
export const successResponse = (data, message = 'Success', meta = null) => {
    const response = {
      success: true,
      message,
      data
    };
  
    if (meta) {
      response.meta = meta;
    }
  
    return response;
  };
  
  // Error response
  export const errorResponse = (message = 'Error occurred', errors = null, statusCode = 500) => {
    const response = {
      success: false,
      message,
      statusCode
    };
  
    if (errors) {
      response.errors = errors;
    }
  
    return response;
  };

// Not found response
export const notFoundResponse = (resource = 'Resource') => {
    return errorResponse(`${resource} not found`, null, 404);
  };

// Validation Error response
export const validationErrorResponse = (errors) => {
    return errorResponse('Validation failed', errors, 400);
  };