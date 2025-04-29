const express = require('express');
const router = express.Router();
const { Subscriber, Popup, Website } = require('../models');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const { validate, subscriberRules } = require('../middleware/validation');
const { logger } = require('../utils/logger');

// Get all subscribers for a website
router.get('/website/:websiteId', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const website = await Website.findOne({ 
      _id: req.params.websiteId,
      userId: req.auth.userId 
    });
    
    if (!website) {
      return res.status(404).json({ status: 'error', message: 'Website not found' });
    }
    
    const subscribers = await Subscriber.find({ websiteId: website._id })
      .sort({ createdAt: -1 });
      
    res.json({ status: 'success', data: subscribers });
  } catch (error) {
    logger.error('Error fetching subscribers:', error);
    res.status(500).json({ status: 'error', message: 'Error fetching subscribers' });
  }
});

// Get subscribers for a specific popup
router.get('/popup/:popupId', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const popup = await Popup.findOne({ 
      _id: req.params.popupId,
      userId: req.auth.userId 
    });
    
    if (!popup) {
      return res.status(404).json({ status: 'error', message: 'Popup not found' });
    }
    
    const subscribers = await Subscriber.find({ popupId: popup._id })
      .sort({ createdAt: -1 });
      
    res.json({ status: 'success', data: subscribers });
  } catch (error) {
    logger.error('Error fetching subscribers:', error);
    res.status(500).json({ status: 'error', message: 'Error fetching subscribers' });
  }
});

// Subscribe to a popup (public endpoint)
router.post('/subscribe/:popupId', subscriberRules(), validate, async (req, res) => {
  try {
    const popup = await Popup.findOne({ 
      _id: req.params.popupId,
      status: 'active'
    });
    
    if (!popup) {
      return res.status(404).json({ status: 'error', message: 'Popup not found' });
    }
    
    const website = await Website.findById(popup.websiteId);
    if (!website || website.status !== 'active') {
      return res.status(404).json({ status: 'error', message: 'Website not found or inactive' });
    }
    
    // Check if email already exists for this popup
    const existingSubscriber = await Subscriber.findOne({
      popupId: popup._id,
      email: req.body.email.toLowerCase()
    });
    
    if (existingSubscriber) {
      return res.status(409).json({ 
        status: 'error',
        message: 'Email already subscribed to this popup' 
      });
    }
    
    const subscriber = new Subscriber({
      ...req.body,
      email: req.body.email.toLowerCase(),
      popupId: popup._id,
      websiteId: website._id,
      metadata: {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        referrer: req.headers.referer
      }
    });
    
    await subscriber.save();
    
    // Update website stats
    website.stats.totalSubscribers += 1;
    website.stats.conversionRate = (
      website.stats.totalSubscribers / website.stats.totalImpressions
    ) * 100;
    await website.save();
    
    res.status(201).json({ status: 'success', message: 'Successfully subscribed' });
  } catch (error) {
    logger.error('Error creating subscriber:', error);
    res.status(500).json({ status: 'error', message: 'Error processing subscription' });
  }
});

// Update subscriber status
router.put('/:id/status', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'unsubscribed', 'bounced'].includes(status)) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Invalid status value' 
      });
    }
    
    const subscriber = await Subscriber.findById(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ status: 'error', message: 'Subscriber not found' });
    }
    
    // Verify user owns the website
    const website = await Website.findOne({
      _id: subscriber.websiteId,
      userId: req.auth.userId
    });
    
    if (!website) {
      return res.status(403).json({ status: 'error', message: 'Not authorized' });
    }
    
    subscriber.status = status;
    await subscriber.save();
    
    res.json({ status: 'success', data: subscriber });
  } catch (error) {
    logger.error('Error updating subscriber status:', error);
    res.status(500).json({ status: 'error', message: 'Error updating subscriber status' });
  }
});

// Get all subscribers for user's popups
router.get('/user/popups', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    // First get all popups for the user
    const popups = await Popup.find({ userId: req.auth.userId });
    
    if (!popups.length) {
      return res.json({ status: 'success', data: [] });
    }
    
    // Get all subscribers for these popups
    const subscribers = await Subscriber.find({ 
      popupId: { $in: popups.map(popup => popup._id) } 
    })
    .populate('popupId', 'name') // Include popup name
    .sort({ createdAt: -1 });
    
    res.json({ 
      status: 'success', 
      data: subscribers,
      total: subscribers.length 
    });
  } catch (error) {
    logger.error('Error fetching user subscribers:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Error fetching subscribers' 
    });
  }
});

// Export subscribers for a website
router.get('/website/:websiteId/export', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const website = await Website.findOne({ 
      _id: req.params.websiteId,
      userId: req.auth.userId 
    });
    
    if (!website) {
      return res.status(404).json({ status: 'error', message: 'Website not found' });
    }
    
    const subscribers = await Subscriber.find({ 
      websiteId: website._id,
      status: 'active'
    }).select('email firstName lastName phone city subscriptionDate -_id');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=subscribers-${website.domain}.csv`);
    
    // Create CSV header
    let csv = 'Email,First Name,Last Name,Phone,City,Subscription Date\n';
    
    // Add subscriber data
    subscribers.forEach(sub => {
      csv += `${sub.email},${sub.firstName || ''},${sub.lastName || ''},${sub.phone || ''},${sub.city || ''},${sub.subscriptionDate}\n`;
    });
    
    res.send(csv);
  } catch (error) {
    logger.error('Error exporting subscribers:', error);
    res.status(500).json({ status: 'error', message: 'Error exporting subscribers' });
  }
});

module.exports = router;
