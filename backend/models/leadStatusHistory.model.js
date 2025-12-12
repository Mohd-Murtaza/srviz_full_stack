import mongoose from 'mongoose';
import { LEAD_STATUS } from '../config/constants.js';

const leadStatusHistorySchema = new mongoose.Schema({
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: [true, 'Lead reference is required']
  },
  fromStatus: {
    type: String,
    enum: Object.values(LEAD_STATUS)
  },
  toStatus: {
    type: String,
    enum: Object.values(LEAD_STATUS),
    required: [true, 'To status is required']
  },
  changedBy: {
    type: String,
    default: 'system'
  },
  notes: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
});

// Index for faster queries
leadStatusHistorySchema.index({ lead: 1, timestamp: -1 });

export default mongoose.models.LeadStatusHistory || mongoose.model('LeadStatusHistory', leadStatusHistorySchema);
