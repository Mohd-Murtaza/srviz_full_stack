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
      
      const normalizedEmail = email.toLowerCase().trim();
      
      // Ensure email is verified
      const verifiedRecord = await EmailVerification.findOne({ 
        email: normalizedEmail, 
        verified: true, 
        expiresAt: { $gte: new Date() } 
      });
      
      if (!verifiedRecord) {
        return res.status(400).json(errorResponse('Email not verified. Please verify your email before submitting the enquiry.'));
      }
      
      // **SPAM PREVENTION - Combined Approach**
      
      // 1. Cooldown Check (15 minutes between submissions)
      const lastLead = await Lead.findOne({ 
        email: normalizedEmail 
      }).sort({ createdAt: -1 });
  
      if (lastLead) {
        const timeSinceLastLead = Date.now() - lastLead.createdAt.getTime();
        const cooldownMinutes = 15;
        const cooldownMs = cooldownMinutes * 60 * 1000;
        
        if (timeSinceLastLead < cooldownMs) {
          const remainingMinutes = Math.ceil((cooldownMs - timeSinceLastLead) / 60000);
          return res.status(429).json(errorResponse(
            `Please wait ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} before submitting another enquiry.`
          ));
        }
      }
  
      // 2. Rate Limit Check (5 leads per day)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const todayLeadsCount = await Lead.countDocuments({
        email: normalizedEmail,
        createdAt: { $gte: oneDayAgo }
      });
  
      if (todayLeadsCount >= 5) {
        return res.status(429).json(errorResponse(
          'You have reached the maximum enquiries for today (5). Please try again tomorrow.'
        ));
      }
  
      // 3. Duplicate Check (same event within 7 days)
      if (event) {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const duplicateLead = await Lead.findOne({
          email: normalizedEmail,
          event: event,
          status: { $nin: ['lost', 'converted'] }, // Exclude closed leads
          createdAt: { $gte: sevenDaysAgo }
        });
  
        if (duplicateLead) {
          return res.status(400).json(errorResponse(
            'You already have an active enquiry for this event. Our team will contact you soon.'
          ));
        }
      }
      
      // Create lead
      const lead = await Lead.create({
        name,
        email: normalizedEmail,
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

// Get all leads with pagination and filters
export const getAllLeads = async (req, res) => {
    try {
      // Get query parameters
      const {
        page = PAGINATION.DEFAULT_PAGE,
        limit = PAGINATION.DEFAULT_LIMIT,
        status,
        event,
        month
      } = req.query;
      
      // Build filter
      const filter = {};
      
      if (status) {
        filter.status = status;
      }
      
      if (event) {
        filter.event = event;
      }
      
      if (month) {
        const monthNum = parseInt(month);
        const year = new Date().getFullYear();
        const startDate = new Date(year, monthNum - 1, 1);
        const endDate = new Date(year, monthNum, 0);
        filter.createdAt = { $gte: startDate, $lte: endDate };
      }
      
      // Calculate pagination
      const pageNum = parseInt(page);
      const limitNum = Math.min(parseInt(limit), PAGINATION.MAX_LIMIT);
      const skip = (pageNum - 1) * limitNum;
      
      // Fetch leads
      const [leads, total] = await Promise.all([
        Lead.find(filter)
          .populate('event', 'name location startDate')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        Lead.countDocuments(filter)
      ]);
      
      // Calculate pagination meta
      const totalPages = Math.ceil(total / limitNum);
      
      return res.status(200).json(successResponse(leads, 'Leads fetched successfully', {
        currentPage: pageNum,
        totalPages,
        totalRecords: total,
        recordsPerPage: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }));
      
    } catch (error) {
      console.error('Error fetching leads:', error);
      return res.status(500).json(errorResponse('Failed to fetch leads', error.message));
    }
  };

// Get lead by ID
export const getLeadById = async (req, res) => {
    try {
      const { id } = req.params;
      
      const lead = await Lead.findById(id).populate('event').lean();
      
      if (!lead) {
        return res.status(404).json(notFoundResponse('Lead'));
      }
      
      return res.status(200).json(successResponse(lead, 'Lead fetched successfully'));
      
    } catch (error) {
      console.error('Error fetching lead:', error);
      return res.status(500).json(errorResponse('Failed to fetch lead', error.message));
    }
  };
  
  // Update lead status
export const updateLeadStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      
      if (!status) {
        return res.status(400).json(validationErrorResponse([
          { field: 'status', message: 'Status is required' }
        ]));
      }
      
      // Find lead
      const lead = await Lead.findById(id);
      
      if (!lead) {
        return res.status(404).json(notFoundResponse('Lead'));
      }
      
      // Validate status transition
      const validation = isValidStatusTransition(lead.status, status);
      
      if (!validation.valid) {
        return res.status(400).json(errorResponse(validation.message));
      }
      
      // Update lead status
      const oldStatus = lead.status;
      lead.status = status;
      await lead.save();
      
      // Create status history
      await createStatusHistory(lead._id, oldStatus, status, 'admin', notes || '');
      
      return res.status(200).json(successResponse(lead, 'Lead status updated successfully'));
      
    } catch (error) {
      console.error('Error updating lead status:', error);
      return res.status(500).json(errorResponse('Failed to update lead status', error.message));
    }
  };