import express from 'express';
import { generateQuote, sendQuoteEmailToUser, acceptQuote, declineQuote } from '../controllers/quote.controller.js';

const router = express.Router();

// Generate a quote
router.post('/generate', generateQuote);

// Send quote email to user (admin action)
router.post('/:id/send-email', sendQuoteEmailToUser);

// User accepts quote from email
router.get('/:id/accept', acceptQuote);

// User declines quote from email
router.get('/:id/decline', declineQuote);

export default router;
