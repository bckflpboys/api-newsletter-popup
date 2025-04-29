const mongoose = require('mongoose');

const popupSchema = new mongoose.Schema({
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
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  buttonText: {
    type: String,
    required: true,
    trim: true
  },
  backgroundColor: {
    type: String,
    default: '#FFFFFF'
  },
  textColor: {
    type: String,
    default: '#000000'
  },
  buttonColor: {
    type: String,
    default: '#2196F3'
  },
  buttonTextColor: {
    type: String,
    default: '#FFFFFF'
  },
  themeId: {
    type: String
  },
  websiteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Website',
    required: true
  },
  settings: {
    trigger: {
      type: { type: String, enum: ['time', 'scroll', 'exit'], default: 'time' },
      value: { type: String, default: '5' }
    },
    frequency: {
      show_once: { type: Boolean, default: false },
      cooldown: { type: String, default: '24h' }
    },
    domain: {
      detected: { type: String, required: true },
      allowed: [String]
    }
  },
  formFields: {
    collectEmail: { type: Boolean, default: true },
    emailRequired: { type: Boolean, default: true },
    collectFirstName: { type: Boolean, default: false },
    firstNameRequired: { type: Boolean, default: false },
    collectLastName: { type: Boolean, default: false },
    lastNameRequired: { type: Boolean, default: false },
    collectPhone: { type: Boolean, default: false },
    phoneRequired: { type: Boolean, default: false },
    collectCity: { type: Boolean, default: false },
    cityRequired: { type: Boolean, default: false }
  },
  features: { type: String, default: 'aa.bb.cc' },
  ab_testing: {
    enabled: { type: Boolean, default: false },
    split: { type: Number, default: 50 },
    variants: {
      A: {
        theme: {
          backgroundColor: { type: String, default: '#FFFFFF' },
          textColor: { type: String, default: '#000000' },
          buttonColor: { type: String, default: '#2196F3' },
          buttonTextColor: { type: String, default: '#FFFFFF' },
          borderColor: { type: String, default: '#e0e0e0' },
          borderWidth: { type: String, default: '0' }
        },
        content: {
          title: { type: String },
          description: { type: String },
          buttonText: { type: String }
        },
        stats: {
          views: { type: Number, default: 0 },
          conversions: { type: Number, default: 0 }
        }
      },
      B: {
        theme: {
          backgroundColor: { type: String, default: '#FFFFFF' },
          textColor: { type: String, default: '#000000' },
          buttonColor: { type: String, default: '#2196F3' },
          buttonTextColor: { type: String, default: '#FFFFFF' },
          borderColor: { type: String, default: '#e0e0e0' },
          borderWidth: { type: String, default: '0' }
        },
        content: {
          title: { type: String },
          description: { type: String },
          buttonText: { type: String }
        },
        stats: {
          views: { type: Number, default: 0 },
          conversions: { type: Number, default: 0 }
        }
      }
    }
  }
}, {
  timestamps: true
});

// Add indexes for common queries
popupSchema.index({ userId: 1, status: 1 });
popupSchema.index({ websiteId: 1, status: 1 });
popupSchema.index({ 'analytics.views': 1 });
popupSchema.index({ 'analytics.conversion_rate': 1 });

const Popup = mongoose.model('Popup', popupSchema);

module.exports = Popup;
