import express from 'express';
import { createLead } from '../controllers/lead.controller.js';

const router = express.Router();

// Create a new lead
router.post('/', createLead);


export default router;
