import Event from '../models/event.model.js';
import Package from '../models/package.model.js';
import { successResponse, errorResponse, notFoundResponse } from '../utils/response.js';

// Get all events with packages
export const getAllEvents = async (req, res) => {
  try {
    // Get query parameters
    const { featured, active = 'true' } = req.query;
    
    // Build filter
    const filter = { active: active === 'true' };
    
    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }
    
    // Fetch events
    const events = await Event.find(filter)
      .sort({ featured: -1, startDate: 1 })
      .lean();
    
    // Fetch packages for each event
    const eventsWithPackages = await Promise.all(
      events.map(async (event) => {
        const packages = await Package.find({ event: event._id, active: true }).lean();
        return { ...event, packages };
      })
    );
    
    return res.status(200).json(successResponse(eventsWithPackages, 'Events fetched successfully'));
    
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json(errorResponse('Failed to fetch events', error.message));
  }
};

// Get event by ID with packages
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Fetch event
    const event = await Event.findById(id).lean();
    
    if (!event) {
      return res.status(404).json(notFoundResponse('Event'));
    }
    
    // Fetch packages for this event
    const packages = await Package.find({ event: id, active: true })
      .sort({ basePrice: 1 })
      .lean();
    
    return res.status(200).json(successResponse({
      event,
      packages
    }, 'Event and packages fetched successfully'));
    
  } catch (error) {
    console.error('Error fetching event:', error);
    return res.status(500).json(errorResponse('Failed to fetch event', error.message));
  }
};
