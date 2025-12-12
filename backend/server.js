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

// Import utils
import { errorResponse } from './utils/response.js';
// Import routes
import healthRoutes from './routes/health.routes.js';
import eventRoutes from './routes/event.routes.js';
import leadRoutes from './routes/lead.routes.js';
import emailVerificationRoutes from './routes/emailVerification.routes.js';
import dbConnect from './config/db.js';

// Connect to database
await dbConnect();

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/verify-email', emailVerificationRoutes);

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