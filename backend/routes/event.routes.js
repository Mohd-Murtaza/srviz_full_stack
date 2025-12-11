import express from 'express';
import { getAllEvents, getEventById } from '../controllers/event.controller.js';

const router = express.Router();

// Get all events with packages
router.get('/', getAllEvents);

// Get event by ID with packages
router.get('/:id', getEventById);

export default router;
