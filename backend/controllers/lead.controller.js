import Lead from '../models/lead.model.js';
import EmailVerification from '../models/emailVerification.model.js';
import { errorResponse, successResponse, validationErrorResponse } from '../utils/response.js';
import { PAGINATION, LEAD_STATUS } from '../config/constants.js';
import { createStatusHistory, isValidStatusTransition } from '../services/leadWorkflow.service.js';

// Create a new lead
export const createLead = async (req, res) => {
    try {
      const { name, email, phone, message, event, numberOfTravellers, preferredDate } = req.body;
      
      // Validation
      if (!name || !email || !phone) {
        return res.status(400).json(validationErrorResponse([
          { field: 'name', message: 'Name is required' },
          { field: 'email', message: 'Email is required' },
          { field: 'phone', message: 'Phone is required' }
        ]));
      }
      
      // Ensure email is verified
      const verifiedRecord = await EmailVerification.findOne({ 
        email: email.toLowerCase().trim(), 
        verified: true, 
        expiresAt: { $gte: new Date() } 
      });
      
      if (!verifiedRecord) {
        return res.status(400).json(errorResponse('Email not verified. Please verify your email before submitting the enquiry.'));
      }
      
      // Create lead
      const lead = await Lead.create({
        name,
        email,
        phone,
        message,
        event: event || null,
        numberOfTravellers: numberOfTravellers || 1,
        preferredDate: preferredDate || null,
        status: LEAD_STATUS.NEW
      });
      
      // Create status history
      await createStatusHistory(lead._id, null, LEAD_STATUS.NEW, 'system', 'Lead created');
      
      // Populate event if exists
      await lead.populate('event');
      
      return res.status(201).json(successResponse(lead, 'Lead created successfully'));
      
    } catch (error) {
      console.error('Error creating lead:', error);
      
      if (error.name === 'ValidationError') {
        const errors = Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }));
        return res.status(400).json(validationErrorResponse(errors));
      }
      
      return res.status(500).json(errorResponse('Failed to create lead', error.message));
    }
  };