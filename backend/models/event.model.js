import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Event description is required']
  },
  location: {
    type: String,
    required: [true, 'Event location is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  image: {
    type: String,
    required: [true, 'Event image is required']
  },
  featured: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
eventSchema.index({ featured: 1, active: 1 });
eventSchema.index({ startDate: 1 });

export default mongoose.models.Event || mongoose.model('Event', eventSchema);
