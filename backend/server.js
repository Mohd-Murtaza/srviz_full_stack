import dotenv from 'dotenv';
dotenv.config();

// Import dependencies
import express from 'express';
import cors from 'cors';
import dbConnect from './config/db.js';

// Import middlewares
import { requestLogger } from './middlewares/logger.middleware.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

// Import routes
import healthRoutes from './routes/health.routes.js';
import eventRoutes from './routes/event.routes.js';
import leadRoutes from './routes/lead.routes.js';
import emailVerificationRoutes from './routes/emailVerification.routes.js';
import quoteRoutes from './routes/quote.routes.js';


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Connect to database
await dbConnect();

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/verify-email', emailVerificationRoutes);
app.use('/api/quotes', quoteRoutes);

// error handling
app.use(errorHandler);
app.use(notFoundHandler);

// Start server
app.listen(PORT, () => {
    console.log('🚀 Server is running!');
    console.log(`📡 API available at: http://localhost:${PORT}/api`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});