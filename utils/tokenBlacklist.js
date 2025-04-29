const redis = require('redis');
const { promisify } = require('util');
const { logger } = require('./logger');

const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  password: process.env.REDIS_PASSWORD
});

const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);
const delAsync = promisify(client.del).bind(client);

client.on('error', (err) => logger.error('Redis Client Error', err));

const tokenBlacklist = {
  // Add token to blacklist
  addToBlacklist: async (token, reason = 'logout', expirationTime = 24 * 60 * 60) => {
    try {
      const blacklistEntry = {
        token,
        reason,
        timestamp: Date.now()
      };

      await setAsync(
        `blacklist:${token}`,
        JSON.stringify(blacklistEntry),
        'EX',
        expirationTime
      );

      logger.info({
        type: 'TOKEN_BLACKLISTED',
        token: token.substring(0, 10) + '...',
        reason
      });

      return true;
    } catch (error) {
      logger.error('Error adding token to blacklist:', error);
      return false;
    }
  },

  // Check if token is blacklisted
  isBlacklisted: async (token) => {
    try {
      const result = await getAsync(`blacklist:${token}`);
      return !!result;
    } catch (error) {
      logger.error('Error checking token blacklist:', error);
      return true; // Fail secure - if we can't check, assume it's blacklisted
    }
  },

  // Remove token from blacklist (rarely needed)
  removeFromBlacklist: async (token) => {
    try {
      await delAsync(`blacklist:${token}`);
      
      logger.info({
        type: 'TOKEN_REMOVED_FROM_BLACKLIST',
        token: token.substring(0, 10) + '...'
      });

      return true;
    } catch (error) {
      logger.error('Error removing token from blacklist:', error);
      return false;
    }
  },

  // Get blacklist entry details
  getBlacklistEntry: async (token) => {
    try {
      const entry = await getAsync(`blacklist:${token}`);
      return entry ? JSON.parse(entry) : null;
    } catch (error) {
      logger.error('Error getting blacklist entry:', error);
      return null;
    }
  }
};

module.exports = tokenBlacklist;
