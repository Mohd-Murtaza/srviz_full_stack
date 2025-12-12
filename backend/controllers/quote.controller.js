import Lead from '../models/lead.model.js';
import Package from '../models/package.model.js';
import Quote from '../models/quote.model.js';
import { successResponse, errorResponse, notFoundResponse, validationErrorResponse } from '../utils/response.js';
import { calculateQuotePrice } from '../services/pricing.service.js';
import { createStatusHistory } from '../services/leadWorkflow.service.js';
import { LEAD_STATUS } from '../config/constants.js';
import { addDays } from 'date-fns';

// Generate a quote
export const generateQuote = async (req, res) => {
  try {
    const { leadId, packageId, travelers, travelDate } = req.body;
    console.log('Received quote generation request:', req.body);
    
    // Validation
    if (!leadId || !packageId || !travelers || !travelDate) {
      return res.status(400).json(validationErrorResponse([
        { field: 'leadId', message: 'Lead ID is required' },
        { field: 'packageId', message: 'Package ID is required' },
        { field: 'travelers', message: 'Number of travelers is required' },
        { field: 'travelDate', message: 'Travel date is required' }
      ]));
    }
    
    // Fetch lead
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json(notFoundResponse('Lead'));
    }
    
    // Fetch package
    const packageData = await Package.findById(packageId).populate('event');
    if (!packageData) {
      return res.status(404).json(notFoundResponse('Package'));
    }
    
    // Calculate pricing
    const pricingDetails = calculateQuotePrice(
      packageData.basePrice,
      travelers,
      new Date(travelDate)
    );
    
    // Create quote
    const quote = await Quote.create({
      lead: leadId,
      package: packageId,
      event: packageData.event._id,
      numberOfTravellers: travelers,
      eventDate: new Date(travelDate),
      basePrice: pricingDetails.basePrice,
      adjustments: {
        seasonal: pricingDetails.adjustments.seasonal.amount,
        earlyBird: pricingDetails.adjustments.earlyBird.amount,
        lastMinute: pricingDetails.adjustments.lastMinute.amount,
        group: pricingDetails.adjustments.group.amount,
        weekend: pricingDetails.adjustments.weekend.amount
      },
      finalPrice: pricingDetails.finalPrice,
      validUntil: addDays(new Date(), 30) // Quote valid for 30 days
    });
    
    // Update lead status to "Quote Sent"
    const oldStatus = lead.status;
    lead.status = LEAD_STATUS.QUOTE_SENT;
    lead.numberOfTravellers = travelers;
    lead.preferredDate = new Date(travelDate);
    lead.event = packageData.event._id;
    await lead.save();
    
    // Create status history
    await createStatusHistory(
      lead._id,
      oldStatus,
      LEAD_STATUS.QUOTE_SENT,
      'system',
      `Quote generated: ₹${pricingDetails.finalPrice}`
    );
    
    // Populate quote references
    await quote.populate(['lead', 'package', 'event']);
    
    // Format response for frontend
    const responseData = {
      _id: quote._id,
      basePrice: pricingDetails.basePrice,
      finalPrice: pricingDetails.finalPrice,
      travelers: travelers,
      adjustments: {
        seasonal: pricingDetails.adjustments.seasonal.multiplier,
        earlyBird: pricingDetails.adjustments.earlyBird.percentage,
        lastMinute: pricingDetails.adjustments.lastMinute.percentage,
        group: pricingDetails.adjustments.group.percentage,
        weekend: pricingDetails.adjustments.weekend.percentage,
      },
      quote: quote,
      pricingBreakdown: pricingDetails,
      leadStatus: LEAD_STATUS.QUOTE_SENT
    };
    
    return res.status(201).json(successResponse(responseData, 'Quote generated successfully'));
    
  } catch (error) {
    console.error('Error generating quote:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));
      return res.status(400).json(validationErrorResponse(errors));
    }
    
    return res.status(500).json(errorResponse('Failed to generate quote', error.message));
  }
};
