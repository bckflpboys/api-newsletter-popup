const { withMiddleware } = require('../index');
const Popup = require('../../models/Popup');
const { logger } = require('../../utils/logger');

// GET /api/popups
module.exports = withMiddleware(async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { websiteId } = req.query;
      
      if (!websiteId) {
        return res.status(400).json({
          status: 'error',
          message: 'Website ID is required'
        });
      }

      const popups = await Popup.find({ websiteId }).sort({ createdAt: -1 });
      
      return res.status(200).json({
        status: 'success',
        data: popups
      });
    } catch (error) {
      logger.error('Error fetching popups:', error);
      throw error;
    }
  }

  if (req.method === 'POST') {
    try {
      const popup = new Popup(req.body);
      await popup.validate();
      const savedPopup = await popup.save();

      return res.status(201).json({
        status: 'success',
        data: savedPopup
      });
    } catch (error) {
      logger.error('Error creating popup:', error);
      throw error;
    }
  }

  return res.status(405).json({
    status: 'error',
    message: 'Method not allowed'
  });
});