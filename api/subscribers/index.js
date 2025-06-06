const { withMiddleware } = require('../index');
const { Subscriber, Popup, Website } = require('../../models');
const { logger } = require('../../utils/logger');

module.exports = withMiddleware(async (req, res) => {
  // GET /api/subscribers
  if (req.method === 'GET') {
    try {
      const { websiteId, popupId } = req.query;
      
      if (websiteId) {
        const website = await Website.findOne({ 
          _id: websiteId,
          userId: req.auth.userId 
        });
        
        if (!website) {
          return res.status(404).json({ status: 'error', message: 'Website not found' });
        }
        
        const subscribers = await Subscriber.find({ websiteId })
          .sort({ createdAt: -1 });
          
        return res.json({ status: 'success', data: subscribers });
      }
      
      if (popupId) {
        const popup = await Popup.findOne({ 
          _id: popupId,
          userId: req.auth.userId 
        });
        
        if (!popup) {
          return res.status(404).json({ status: 'error', message: 'Popup not found' });
        }
        
        const subscribers = await Subscriber.find({ popupId })
          .sort({ createdAt: -1 });
          
        return res.json({ status: 'success', data: subscribers });
      }
      
      return res.status(400).json({
        status: 'error',
        message: 'Either websiteId or popupId is required'
      });
    } catch (error) {
      logger.error('Error fetching subscribers:', error);
      throw error;
    }
  }

  // POST /api/subscribers
  if (req.method === 'POST') {
    try {
      const { email, websiteId, popupId } = req.body;
      
      // Validate website exists
      const website = await Website.findById(websiteId);
      if (!website) {
        return res.status(404).json({
          status: 'error',
          message: 'Website not found'
        });
      }
      
      // Check if popup exists if popupId is provided
      if (popupId) {
        const popup = await Popup.findById(popupId);
        if (!popup) {
          return res.status(404).json({
            status: 'error',
            message: 'Popup not found'
          });
        }
      }
      
      // Check if subscriber already exists
      const existingSubscriber = await Subscriber.findOne({
        email,
        websiteId
      });
      
      if (existingSubscriber) {
        return res.status(409).json({
          status: 'error',
          message: 'Email already subscribed'
        });
      }
      
      const subscriber = new Subscriber({
        email,
        websiteId,
        popupId
      });
      
      await subscriber.validate();
      const savedSubscriber = await subscriber.save();
      
      return res.status(201).json({
        status: 'success',
        data: savedSubscriber
      });
    } catch (error) {
      logger.error('Error creating subscriber:', error);
      throw error;
    }
  }

  // DELETE /api/subscribers
  if (req.method === 'DELETE') {
    try {
      const { id, websiteId } = req.query;
      
      // Verify website ownership
      const website = await Website.findOne({
        _id: websiteId,
        userId: req.auth.userId
      });
      
      if (!website) {
        return res.status(404).json({
          status: 'error',
          message: 'Website not found'
        });
      }
      
      const subscriber = await Subscriber.findOneAndDelete({
        _id: id,
        websiteId
      });
      
      if (!subscriber) {
        return res.status(404).json({
          status: 'error',
          message: 'Subscriber not found'
        });
      }
      
      return res.json({
        status: 'success',
        data: subscriber
      });
    } catch (error) {
      logger.error('Error deleting subscriber:', error);
      throw error;
    }
  }

  return res.status(405).json({
    status: 'error',
    message: 'Method not allowed'
  });
}));