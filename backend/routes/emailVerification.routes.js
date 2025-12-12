import express from 'express';
import { sendVerificationEmail, verifyEmailToken } from '../controllers/emailVerification.controller.js';
import { emailRateLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = express.Router();

// Send verification email (with rate limiting)
router.post('/send', emailRateLimiter(), sendVerificationEmail);

// Verify email token
router.get('/:token', verifyEmailToken);

export default router;
