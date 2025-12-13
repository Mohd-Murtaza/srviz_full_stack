import mongoose from 'mongoose';
import { LEAD_STATUS } from '../config/constants.js';

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true
  },
  message: {
    type: String,
    trim: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package'
  },
  numberOfTravellers: {
    type: Number,
    min: [1, 'Number of travellers must be at least 1'],
    default: 1
  },
  preferredDate: {
    type: Date
  },
  status: {
    type: String,
    enum: Object.values(LEAD_STATUS),
    default: LEAD_STATUS.NEW
  }
}, {
  timestamps: true
});

// Indexes for faster queries
leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ event: 1 });
leadSchema.index({ package: 1 });
leadSchema.index({ createdAt: -1 });

export default mongoose.models.Lead || mongoose.model('Lead', leadSchema);
