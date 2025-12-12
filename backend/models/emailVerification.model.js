import mongoose from 'mongoose';

const emailVerificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  token: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  verified: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true
});

// TTL index could be added if desired, but we manage expiry checks in code
emailVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.EmailVerification || mongoose.model('EmailVerification', emailVerificationSchema);
