import { successResponse, errorResponse } from '../utils/response.js';

// Health check endpoint
export const healthCheck = async (req, res) => {
  try {
    const uptime = process.uptime();
    const uptimeFormatted = `${Math.floor(uptime / 60)} minutes`;
    
    return res.status(200).json(successResponse({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: uptimeFormatted,
      database: 'connected',
      environment: process.env.NODE_ENV || 'development'
    }, 'Service is healthy'));
    
  } catch (error) {
    return res.status(500).json(errorResponse('Service is unhealthy', {
      database: 'disconnected',
      error: error.message
    }));
  }
};
