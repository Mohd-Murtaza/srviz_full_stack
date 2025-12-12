import { PRICING_RULES } from '../config/constants.js';
import { getDaysBetween, isWeekend, getMonth } from '../utils/dateHelpers.js';

/**
 * Calculate seasonal multiplier based on event date
 * June, July, December → +20%
 * April, May, September → +10%
 */
const calculateSeasonalAdjustment = (eventDate, basePrice) => {
  const month = getMonth(eventDate);
  
  if (PRICING_RULES.SEASONAL.HIGH.months.includes(month)) {
    const adjustment = basePrice * (PRICING_RULES.SEASONAL.HIGH.multiplier - 1);
    return { amount: adjustment, percentage: 20, reason: 'High Season (Jun/Jul/Dec)' };
  }
  
  if (PRICING_RULES.SEASONAL.MEDIUM.months.includes(month)) {
    const adjustment = basePrice * (PRICING_RULES.SEASONAL.MEDIUM.multiplier - 1);
    return { amount: adjustment, percentage: 10, reason: 'Medium Season (Apr/May/Sep)' };
  }
  
  return { amount: 0, percentage: 0, reason: 'Regular Season' };
};

/**
 * Calculate early bird discount
 * 120+ days before event → -10%
 */
const calculateEarlyBirdDiscount = (eventDate, basePrice) => {
  const daysUntilEvent = getDaysBetween(new Date(), eventDate);
  
  if (daysUntilEvent >= PRICING_RULES.EARLY_BIRD.days) {
    const discount = basePrice * PRICING_RULES.EARLY_BIRD.discount;
    return { amount: -discount, percentage: -10, reason: `Early Bird (${daysUntilEvent} days ahead)` };
  }
  
  return { amount: 0, percentage: 0, reason: 'Not applicable' };
};

/**
 * Calculate last minute surcharge
 * <15 days before event → +25%
 */
const calculateLastMinuteSurcharge = (eventDate, basePrice) => {
  const daysUntilEvent = getDaysBetween(new Date(), eventDate);
  
  if (daysUntilEvent < PRICING_RULES.LAST_MINUTE.days && daysUntilEvent >= 0) {
    const surcharge = basePrice * PRICING_RULES.LAST_MINUTE.surcharge;
    return { amount: surcharge, percentage: 25, reason: `Last Minute (${daysUntilEvent} days left)` };
  }
  
  return { amount: 0, percentage: 0, reason: 'Not applicable' };
};

/**
 * Calculate group discount
 * 4+ travellers → -8%
 */
const calculateGroupDiscount = (numberOfTravellers, basePrice) => {
  if (numberOfTravellers >= PRICING_RULES.GROUP.minTravellers) {
    const discount = basePrice * PRICING_RULES.GROUP.discount;
    return { amount: -discount, percentage: -8, reason: `Group Discount (${numberOfTravellers} travellers)` };
  }
  
  return { amount: 0, percentage: 0, reason: 'Not applicable' };
};

/**
 * Calculate weekend surcharge
 * If event includes Saturday or Sunday → +8%
 */
const calculateWeekendSurcharge = (eventDate, basePrice) => {
  if (isWeekend(eventDate)) {
    const surcharge = basePrice * PRICING_RULES.WEEKEND.surcharge;
    return { amount: surcharge, percentage: 8, reason: 'Weekend Event' };
  }
  
  return { amount: 0, percentage: 0, reason: 'Not applicable' };
};

/**
 * Main pricing calculation function
 * Applies all business rules and returns detailed breakdown
 */
export const calculateQuotePrice = (basePrice, numberOfTravellers, eventDate) => {
  // Calculate base price for all travellers
  const totalBasePrice = basePrice * numberOfTravellers;
  
  // Calculate all adjustments
  const seasonal = calculateSeasonalAdjustment(eventDate, totalBasePrice);
  const earlyBird = calculateEarlyBirdDiscount(eventDate, totalBasePrice);
  const lastMinute = calculateLastMinuteSurcharge(eventDate, totalBasePrice);
  const group = calculateGroupDiscount(numberOfTravellers, totalBasePrice);
  const weekend = calculateWeekendSurcharge(eventDate, totalBasePrice);
  
  // Calculate final price
  const totalAdjustments = 
    seasonal.amount + 
    earlyBird.amount + 
    lastMinute.amount + 
    group.amount + 
    weekend.amount;
  
  const finalPrice = totalBasePrice + totalAdjustments;
  
  return {
    basePrice: totalBasePrice,
    pricePerPerson: basePrice,
    numberOfTravellers,
    adjustments: {
      seasonal: {
        amount: parseFloat(seasonal.amount.toFixed(2)),
        percentage: seasonal.percentage,
        reason: seasonal.reason,
        multiplier: seasonal.percentage ? 1 + (seasonal.percentage / 100) : 1
      },
      earlyBird: {
        amount: parseFloat(earlyBird.amount.toFixed(2)),
        percentage: earlyBird.percentage,
        reason: earlyBird.reason
      },
      lastMinute: {
        amount: parseFloat(lastMinute.amount.toFixed(2)),
        percentage: lastMinute.percentage,
        reason: lastMinute.reason
      },
      group: {
        amount: parseFloat(group.amount.toFixed(2)),
        percentage: group.percentage,
        reason: group.reason
      },
      weekend: {
        amount: parseFloat(weekend.amount.toFixed(2)),
        percentage: weekend.percentage,
        reason: weekend.reason
      }
    },
    totalAdjustments: parseFloat(totalAdjustments.toFixed(2)),
    finalPrice: parseFloat(finalPrice.toFixed(2))
  };
};
