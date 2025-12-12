import { LEAD_STATUS, VALID_STATUS_TRANSITIONS } from '../config/constants.js';
import LeadStatusHistory from '../models/leadStatusHistory.model.js';

/**
 * Validate if status transition is allowed
 */
export const isValidStatusTransition = (currentStatus, newStatus) => {
  // If same status, no transition needed
  if (currentStatus === newStatus) {
    return { valid: false, message: 'Lead is already in this status' };
  }
  
  // Check if transition is allowed
  const allowedTransitions = VALID_STATUS_TRANSITIONS[currentStatus] || [];
  
  if (!allowedTransitions.includes(newStatus)) {
    return {
      valid: false,
      message: `Invalid status transition from "${currentStatus}" to "${newStatus}". Allowed transitions: ${allowedTransitions.join(', ')}`
    };
  }
  
  return { valid: true };
};

/**
 * Create status history record
 */
export const createStatusHistory = async (leadId, fromStatus, toStatus, changedBy = 'system', notes = '') => {
  try {
    const history = await LeadStatusHistory.create({
      lead: leadId,
      fromStatus,
      toStatus,
      changedBy,
      notes
    });
    
    return history;
  } catch (error) {
    console.error('Error creating status history:', error);
    throw new Error('Failed to create status history');
  }
};

/**
 * Get status history for a lead
 */
export const getLeadStatusHistory = async (leadId) => {
  try {
    const history = await LeadStatusHistory.find({ lead: leadId })
      .sort({ timestamp: -1 });
    
    return history;
  } catch (error) {
    console.error('Error fetching status history:', error);
    throw new Error('Failed to fetch status history');
  }
};

/**
 * Get all available statuses
 */
export const getAllStatuses = () => {
  return Object.values(LEAD_STATUS);
};

/**
 * Get next possible statuses for a given status
 */
export const getNextPossibleStatuses = (currentStatus) => {
  return VALID_STATUS_TRANSITIONS[currentStatus] || [];
};
