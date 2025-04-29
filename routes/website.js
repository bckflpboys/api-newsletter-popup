const express = require('express');
const router = express.Router();
const { Website } = require('../models');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const { validate, websiteRules } = require('../middleware/validation');
const { logger } = require('../utils/logger');

// Get all websites for the authenticated user
router.get('/', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const websites = await Website.find({ userId: req.auth.userId });
    res.json({ status: 'success', data: websites });
  } catch (error) {
    logger.error('Error fetching websites:', error);
    res.status(500).json({ status: 'error', message: 'Error fetching websites' });
  }
});

// Get a single website by ID
router.get('/:id', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const website = await Website.findOne({ 
      _id: req.params.id,
      userId: req.auth.userId 
    });
    
    if (!website) {
      return res.status(404).json({ status: 'error', message: 'Website not found' });
    }
    
    res.json({ status: 'success', data: website });
  } catch (error) {
    logger.error('Error fetching website:', error);
    res.status(500).json({ status: 'error', message: 'Error fetching website' });
  }
});

// Create a new website or get existing one
router.post('/', ClerkExpressRequireAuth(), websiteRules(), validate, async (req, res) => {
  try {
    const { name, domain } = req.body;
    const normalizedDomain = domain.toLowerCase();
    
    // Check if website already exists for this user
    const existingWebsite = await Website.findOne({ 
      userId: req.auth.userId,
      domain: normalizedDomain
    });
    
    if (existingWebsite) {
      return res.json({ 
        status: 'success',
        data: existingWebsite,
        message: 'Using existing website'
      });
    }
    
    const website = new Website({
      userId: req.auth.userId,
      name,
      domain: normalizedDomain,
      status: 'active'  // Auto-activate for localhost
    });
    
    await website.save();
    res.status(201).json({ status: 'success', data: website });
  } catch (error) {
    logger.error('Error with website:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Error processing website request' });
  }
});

// Update a website
router.put('/:id', ClerkExpressRequireAuth(), websiteRules(), validate, async (req, res) => {
  try {
    const website = await Website.findOne({ 
      _id: req.params.id,
      userId: req.auth.userId 
    });
    
    if (!website) {
      return res.status(404).json({ status: 'error', message: 'Website not found' });
    }
    
    const updates = req.body;
    delete updates.userId; // Prevent userId from being updated
    delete updates.verificationToken; // Prevent verification token from being updated
    
    Object.assign(website, updates);
    await website.save();
    
    res.json({ status: 'success', data: website });
  } catch (error) {
    logger.error('Error updating website:', error);
    res.status(500).json({ status: 'error', message: 'Error updating website' });
  }
});

// Delete a website
router.delete('/:id', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const website = await Website.findOneAndDelete({ 
      _id: req.params.id,
      userId: req.auth.userId 
    });
    
    if (!website) {
      return res.status(404).json({ status: 'error', message: 'Website not found' });
    }
    
    res.json({ status: 'success', message: 'Website deleted successfully' });
  } catch (error) {
    logger.error('Error deleting website:', error);
    res.status(500).json({ status: 'error', message: 'Error deleting website' });
  }
});

module.exports = router;
