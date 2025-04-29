const express = require('express');
const router = express.Router();
const websiteRoutes = require('./website.js');
const popupRoutes = require('./popup');
const subscriberRoutes = require('./subscriber');

// Mount routes
router.use('/websites', websiteRoutes);
router.use('/popups', popupRoutes);
router.use('/subscribers', subscriberRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'success', message: 'API is running' });
});

module.exports = router;
