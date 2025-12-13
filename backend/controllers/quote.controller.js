import Lead from '../models/lead.model.js';
import Package from '../models/package.model.js';
import Quote from '../models/quote.model.js';
import { successResponse, errorResponse, notFoundResponse, validationErrorResponse } from '../utils/response.js';
import { calculateQuotePrice } from '../services/pricing.service.js';
import { createStatusHistory } from '../services/leadWorkflow.service.js';
import { sendQuoteEmail } from '../services/quoteEmail.service.js';
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

// Send quote email to user
export const sendQuoteEmailToUser = async (req, res) => {
  try {
    const { id } = req.params; // Quote ID

    // Fetch quote with populated references
    const quote = await Quote.findById(id)
      .populate('lead')
      .populate('event')
      .populate('package');

    if (!quote) {
      return res.status(404).json(notFoundResponse('Quote'));
    }

    // Check if email already sent recently (prevent spam)
    if (quote.emailSent && quote.emailSentAt) {
      const hoursSinceLastEmail = (Date.now() - quote.emailSentAt.getTime()) / (1000 * 60 * 60);
      if (hoursSinceLastEmail < 1) {
        return res.status(429).json(errorResponse('Email was sent recently. Please wait before sending again.'));
      }
    }

    // Recalculate pricing details for email (to get the complete breakdown)
    const pricingDetails = calculateQuotePrice(
      quote.package.basePrice,
      quote.numberOfTravellers,
      new Date(quote.eventDate)
    );

    // Send email with pricing breakdown
    await sendQuoteEmail(quote, quote.lead, pricingDetails);

    // Update quote
    quote.emailSent = true;
    quote.emailSentAt = new Date();
    await quote.save();

    return res.status(200).json(successResponse({ emailSent: true }, 'Quote email sent successfully'));

  } catch (error) {
    console.error('Error sending quote email:', error);
    return res.status(500).json(errorResponse('Failed to send quote email', error.message));
  }
};

// User accepts quote from email
export const acceptQuote = async (req, res) => {
  try {
    const { id } = req.params; // Quote ID

    // Fetch quote with populated lead
    const quote = await Quote.findById(id).populate('lead');

    if (!quote) {
      return res.status(404).send('<h1>Quote not found</h1><p>This quote may have expired or been removed.</p>');
    }

    // Check if already responded (check for accepted or declined, not just pending)
    if (quote.userResponse && quote.userResponse !== 'pending') {
      return res.status(400).send(`<h1>Quote Already ${quote.userResponse === 'accepted' ? 'Accepted' : 'Declined'}</h1><p>You have already responded to this quote.</p>`);
    }

    // Check if quote is still valid
    if (new Date() > quote.validUntil) {
      return res.status(410).send('<h1>Quote Expired</h1><p>This quote has expired. Please contact us for a new quote.</p>');
    }

    // Update quote
    quote.userResponse = 'accepted';
    quote.userResponseAt = new Date();
    await quote.save();

    // Update lead status to converted
    const lead = await Lead.findById(quote.lead._id);
    if (lead) {
      const oldStatus = lead.status;
      lead.status = LEAD_STATUS.CONVERTED;
      await lead.save();

      // Create status history
      await createStatusHistory(
        lead._id,
        oldStatus,
        LEAD_STATUS.CONVERTED,
        'customer',
        `Quote accepted by customer`
      );
    }

    // Redirect to success page
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return res.send(`
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quote Accepted</title>
  <style>
    body { margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .card { background: white; padding: 48px; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 500px; text-align: center; }
    .icon { font-size: 64px; margin-bottom: 24px; }
    h1 { color: #22c55e; font-size: 32px; margin: 0 0 16px 0; }
    p { color: #64748b; font-size: 16px; line-height: 1.6; }
    .button { display: inline-block; background: #22c55e; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; margin-top: 24px; font-weight: 600; }
    .button:hover { background: #16a34a; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">✅</div>
    <h1>Quote Accepted!</h1>
    <p>Thank you for accepting our quote. Our team will contact you shortly with payment details and next steps for your booking.</p>
    <p><strong>Reference ID:</strong> ${quote._id}</p>
    <a href="${frontendUrl}" class="button">Back to Home</a>
  </div>
</body>
</html>
    `);

  } catch (error) {
    console.error('Error accepting quote:', error);
    return res.status(500).send('<h1>Error</h1><p>Something went wrong. Please try again later.</p>');
  }
};

// User declines quote from email
export const declineQuote = async (req, res) => {
  try {
    const { id } = req.params; // Quote ID

    // Fetch quote with populated lead
    const quote = await Quote.findById(id).populate('lead');

    if (!quote) {
      return res.status(404).send('<h1>Quote not found</h1><p>This quote may have expired or been removed.</p>');
    }

    // Check if already responded (check for accepted or declined, not just pending)
    if (quote.userResponse && quote.userResponse !== 'pending') {
      return res.status(400).send(`<h1>Quote Already ${quote.userResponse === 'accepted' ? 'Accepted' : 'Declined'}</h1><p>You have already responded to this quote.</p>`);
    }

    // Update quote
    quote.userResponse = 'declined';
    quote.userResponseAt = new Date();
    await quote.save();

    // Update lead status to lost
    const lead = await Lead.findById(quote.lead._id);
    if (lead) {
      const oldStatus = lead.status;
      lead.status = LEAD_STATUS.LOST;
      await lead.save();

      // Create status history
      await createStatusHistory(
        lead._id,
        oldStatus,
        LEAD_STATUS.LOST,
        'customer',
        `Quote declined by customer`
      );
    }

    // Redirect to feedback page
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return res.send(`
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quote Declined</title>
  <style>
    body { margin: 0; padding: 0; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .card { background: white; padding: 48px; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 500px; text-align: center; }
    .icon { font-size: 64px; margin-bottom: 24px; }
    h1 { color: #ef4444; font-size: 32px; margin: 0 0 16px 0; }
    p { color: #64748b; font-size: 16px; line-height: 1.6; }
    .button { display: inline-block; background: #3b82f6; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; margin-top: 24px; font-weight: 600; }
    .button:hover { background: #2563eb; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">❌</div>
    <h1>Quote Declined</h1>
    <p>We're sorry this quote didn't meet your expectations. We'd love to help you find the perfect package for your needs.</p>
    <p>Our team is available to discuss alternative options or answer any questions you may have.</p>
    <a href="${frontendUrl}" class="button">Explore Other Events</a>
  </div>
</body>
</html>
    `);

  } catch (error) {
    console.error('Error declining quote:', error);
    return res.status(500).send('<h1>Error</h1><p>Something went wrong. Please try again later.</p>');
  }
};
