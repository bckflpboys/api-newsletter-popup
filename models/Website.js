const mongoose = require('mongoose');

const websiteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  domain: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending_verification'],
    default: 'pending_verification'
  },
  verificationToken: {
    type: String,
    unique: true,
    sparse: true
  },
  verifiedAt: {
    type: Date
  },
  settings: {
    maxPopupsPerPage: {
      type: Number,
      default: 1,
      min: 1,
      max: 5
    },
    popupFrequency: {
      type: Number, // in hours
      default: 24,
      min: 1
    },
    allowMultipleSubscriptions: {
      type: Boolean,
      default: false
    }
  },
  stats: {
    totalImpressions: {
      type: Number,
      default: 0
    },
    totalSubscribers: {
      type: Number,
      default: 0
    },
    conversionRate: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Indexes for common queries
websiteSchema.index({ userId: 1, domain: 1 }, { unique: true });
websiteSchema.index({ domain: 1, status: 1 });

// Pre-save middleware to generate verification token
websiteSchema.pre('save', function(next) {
  if (this.isNew && !this.verificationToken) {
    this.verificationToken = require('crypto').randomBytes(32).toString('hex');
  }
  next();
});

const Website = mongoose.model('Website', websiteSchema);
module.exports = Website;
