import express from 'express';
import { generateQuote } from '../controllers/quote.controller.js';

const router = express.Router();

// Generate a quote
router.post('/generate', generateQuote);

export default router;
