// Lead Status Workflow
export const LEAD_STATUS = {
    NEW: 'New',
    CONTACTED: 'Contacted',
    QUOTE_SENT: 'Quote Sent',
    INTERESTED: 'Interested',
    CLOSED_WON: 'Closed Won',
    CLOSED_LOST: 'Closed Lost'
  };
  
  // Valid status transitions
  export const VALID_STATUS_TRANSITIONS = {
    [LEAD_STATUS.NEW]: [LEAD_STATUS.CONTACTED, LEAD_STATUS.CLOSED_LOST],
    [LEAD_STATUS.CONTACTED]: [LEAD_STATUS.QUOTE_SENT, LEAD_STATUS.CLOSED_LOST],
    [LEAD_STATUS.QUOTE_SENT]: [LEAD_STATUS.INTERESTED, LEAD_STATUS.CLOSED_LOST],
    [LEAD_STATUS.INTERESTED]: [LEAD_STATUS.CLOSED_WON, LEAD_STATUS.CLOSED_LOST],
    [LEAD_STATUS.CLOSED_WON]: [],
    [LEAD_STATUS.CLOSED_LOST]: []
  };
  
  // Pricing multipliers and discounts
  export const PRICING_RULES = {
    SEASONAL: {
      HIGH: { months: [6, 7, 12], multiplier: 1.20 }, // June, July, December
      MEDIUM: { months: [4, 5, 9], multiplier: 1.10 }  // April, May, September
    },
    EARLY_BIRD: {
      days: 120,
      discount: 0.10
    },
    LAST_MINUTE: {
      days: 15,
      surcharge: 0.25
    },
    GROUP: {
      minTravellers: 4,
      discount: 0.08
    },
    WEEKEND: {
      surcharge: 0.08
    }
  };
  
  // Pagination defaults
  export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  };
  