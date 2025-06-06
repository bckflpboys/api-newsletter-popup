const { withMiddleware } = require('../index');
const Website = require('../../models/Website');
const { logger } = require('../../utils/logger');
const { validate, websiteRules } = require('../../middleware/validation');

module.exports = withMiddleware(async (req, res) => {
  // GET /api/websites
  if (req.method === 'GET') {
    try {
      const { id } = req.query;
      
      if (id) {
        const website = await Website.findOne({ 
          _id: id,
          userId: req.auth.userId 
        });
        
        if (!website) {
          return res.status(404).json({ status: 'error', message: 'Website not found' });
        }
        
        return res.json({ status: 'success', data: website });
      }

      const websites = await Website.find({ userId: req.auth.userId });
      return res.json({ status: 'success', data: websites });
    } catch (error) {
      logger.error('Error fetching websites:', error);
      throw error;
    }
  }

  // POST /api/websites
  if (req.method === 'POST') {
    try {
      const { name, domain } = req.body;
      const normalizedDomain = domain.toLowerCase();
      
      // Check if website already exists for this user
      const existingWebsite = await Website.findOne({ 
        userId: req.auth.userId,
        domain: normalizedDomain
      });
      
      if (existingWebsite) {
        return res.json({ status: 'success', data: existingWebsite });
      }
      
      const website = new Website({
        name,
        domain: normalizedDomain,
        userId: req.auth.userId
      });
      
      await website.validate();
      const savedWebsite = await website.save();
      
      return res.status(201).json({ status: 'success', data: savedWebsite });
    } catch (error) {
      logger.error('Error creating website:', error);
      throw error;
    }
  }

  // PUT /api/websites
  if (req.method === 'PUT') {
    try {
      const { id } = req.query;
      const website = await Website.findOne({ 
        _id: id,
        userId: req.auth.userId 
      });
      
      if (!website) {
        return res.status(404).json({ status: 'error', message: 'Website not found' });
      }
      
      Object.assign(website, req.body);
      await website.validate();
      const updatedWebsite = await website.save();
      
      return res.json({ status: 'success', data: updatedWebsite });
    } catch (error) {
      logger.error('Error updating website:', error);
      throw error;
    }
  }

  // DELETE /api/websites
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      const website = await Website.findOneAndDelete({ 
        _id: id,
        userId: req.auth.userId 
      });
      
      if (!website) {
        return res.status(404).json({ status: 'error', message: 'Website not found' });
      }
      
      return res.json({ status: 'success', data: website });
    } catch (error) {
      logger.error('Error deleting website:', error);
      throw error;
    }
  }

  return res.status(405).json({
    status: 'error',
    message: 'Method not allowed'
  });
});