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