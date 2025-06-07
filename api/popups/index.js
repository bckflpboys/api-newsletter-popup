const { withMiddleware } = require('../index');
const Popup = require('../../models/Popup');
const { logger } = require('../../utils/logger');

// GET /api/popups
module.exports = withMiddleware(async (req, res) => {
  if (req.method === 'GET') {
    try {
      const userId = req.auth?.userId;

      if (!userId) {
        // This should ideally be caught by Clerk middleware if a token is invalid or missing.
        // If Clerk allows the request through but userId is somehow not on req.auth,
        // it indicates a problem upstream or with Clerk setup.
        logger.warn('Attempt to fetch popups without a userId in req.auth.');
        return res.status(401).json({
          status: 'error',
          message: 'Authentication failed: User ID not available.'
        });
      }

      // Fetch popups belonging to the authenticated user
      const popups = await Popup.find({ userId: userId }).sort({ createdAt: -1 });
      
      return res.status(200).json({
        status: 'success',
        data: popups // The client expects response.data.data, so this matches.
      });
    } catch (error) {
      // Log the error with context
      logger.error('Error fetching popups for user:', { userId: req.auth?.userId, errorMessage: error.message, errorStack: error.stack });
      // The generic error handler in withMiddleware will catch this and return a 500
      // It's important to throw it so withMiddleware can handle it consistently.
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