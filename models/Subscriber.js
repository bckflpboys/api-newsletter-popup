const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  popupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Popup',
    required: true,
    index: true
  },
  websiteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Website',
    required: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  subscriptionDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'unsubscribed', 'bounced'],
    default: 'active'
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    referrer: String
  }
}, {
  timestamps: true
});

// Compound indexes for efficient querying
subscriberSchema.index({ popupId: 1, email: 1 }, { unique: true });
subscriberSchema.index({ websiteId: 1, status: 1 });
subscriberSchema.index({ subscriptionDate: -1 });

const Subscriber = mongoose.model('Subscriber', subscriberSchema);
module.exports = Subscriber;
