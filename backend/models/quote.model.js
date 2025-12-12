import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema({
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: [true, 'Lead reference is required']
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: [true, 'Package reference is required']
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event reference is required']
  },
  numberOfTravellers: {
    type: Number,
    required: [true, 'Number of travellers is required'],
    min: 1
  },
  eventDate: {
    type: Date,
    required: [true, 'Event date is required']
  },
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: 0
  },
  adjustments: {
    seasonal: {
      type: Number,
      default: 0
    },
    earlyBird: {
      type: Number,
      default: 0
    },
    lastMinute: {
      type: Number,
      default: 0
    },
    group: {
      type: Number,
      default: 0
    },
    weekend: {
      type: Number,
      default: 0
    }
  },
  finalPrice: {
    type: Number,
    required: [true, 'Final price is required'],
    min: 0
  },
  validUntil: {
    type: Date,
    required: [true, 'Valid until date is required']
  }
}, {
  timestamps: true
});

// Index for faster queries
quoteSchema.index({ lead: 1, createdAt: -1 });
quoteSchema.index({ validUntil: 1 });

export default mongoose.models.Quote || mongoose.model('Quote', quoteSchema);
