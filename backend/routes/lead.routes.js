import express from 'express';
import { createLead, getAllLeads, getLeadById, updateLeadStatus } from '../controllers/lead.controller.js';

const router = express.Router();

// Create a new lead
router.post('/', createLead);

// Get all leads with pagination and filters
router.get('/', getAllLeads);

// Get lead by ID
router.get('/:id', getLeadById);

// Update lead status
router.patch('/:id', updateLeadStatus);

export default router;
