import dotenv from 'dotenv';
dotenv.config();

// Import dependencies
import express from 'express';
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
import healthRoutes from './routes/health.routes.js';
import { errorResponse } from './utils/response.js';

// Routes
app.use('/api/health', healthRoutes);

// 404 error handler
app.use((req, res) => {
    return res.status(404).json(errorResponse('Not Found', null, 404));
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 Server is running!');
    console.log(`📡 API available at: http://localhost:${PORT}/api`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});