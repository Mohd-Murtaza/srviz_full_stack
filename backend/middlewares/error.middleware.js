import { errorResponse } from '../utils/response.js';

// Global error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json(errorResponse('Internal server error', err.message));
};

// 404 handler middleware
export const notFoundHandler = (req, res) => {
  res.status(404).json(errorResponse('Endpoint not found'));
};
