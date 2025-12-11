import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event reference is required']
  },
  name: {
    type: String,
    required: [true, 'Package name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Package description is required']
  },
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: [0, 'Base price cannot be negative']
  },
  inclusions: [{
    type: String
  }],
  image: {
    type: String,
    required: [true, 'Package image is required']
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
packageSchema.index({ event: 1, active: 1 });

export default mongoose.models.Package || mongoose.model('Package', packageSchema);
