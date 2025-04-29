const redis = require('redis');
const { promisify } = require('util');
const { logger } = require('../utils/logger');

// Only create Redis client if enabled
const redisEnabled = process.env.REDIS_ENABLED === 'true';
let client = null;

if (redisEnabled) {
  client = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD,
    socket: {
      reconnectStrategy: retries => {
        if (retries > 10) {
          return new Error('Redis max retries reached');
        }
        return Math.min(retries * 100, 3000);
      }
    }
  });

  // Connect to Redis
  (async () => {
    try {
      await client.connect();
      logger.info('Redis client connected');
    } catch (err) {
      logger.error('Redis connection error:', err);
    }
  })();
} else {
  logger.info('Redis is disabled, brute force protection will be skipped');
}

const WINDOW_SIZE_IN_HOURS = 24;
const MAX_WINDOW_REQUEST_COUNT = 1000;
const WINDOW_LOG_INTERVAL_IN_HOURS = 1;

const bruteForceProtection = async (req, res, next) => {
  // Skip brute force check if Redis is disabled or not connected
  if (!redisEnabled || !client || !client.isOpen) {
    return next();
  }

  try {
    // Current timestamp in seconds
    const now = Math.floor(Date.now() / 1000);

    // Build unique identifier based on IP and route
    const identifier = `${req.ip}-${req.path}`;

    // Get records for this identifier
    let record;
    try {
      record = await client.get(identifier);
    } catch (err) {
      logger.error('Error getting record from Redis:', err);
      return next();
    }

    const currentRequestTime = now;
    
    // If no record found, create a new one
    if (!record) {
      const newRecord = {
        count: 1,
        requestLog: [currentRequestTime]
      };
      
      await client.set(identifier, JSON.stringify(newRecord));
      return next();
    }

    // Parse existing record
    let parsedRecord = JSON.parse(record);
    const windowStartTimestamp = now - WINDOW_SIZE_IN_HOURS * 60 * 60;

    // Filter out requests older than window size
    parsedRecord.requestLog = parsedRecord.requestLog.filter(timestamp => 
      timestamp > windowStartTimestamp
    );

    // Check if request count exceeds limit
    if (parsedRecord.requestLog.length >= MAX_WINDOW_REQUEST_COUNT) {
      return res.status(429).json({
        status: 'error',
        message: 'Too many requests',
        retryAfter: WINDOW_LOG_INTERVAL_IN_HOURS * 60 * 60
      });
    }

    // Update record with current request
    parsedRecord.count = parsedRecord.requestLog.length + 1;
    parsedRecord.requestLog.push(currentRequestTime);
    
    await client.set(identifier, JSON.stringify(parsedRecord));
    next();

  } catch (err) {
    logger.error('Brute force protection error:', err);
    next();
  }
};

// Handle Redis client errors
if (client) {
  client.on('error', (err) => {
    logger.error('Redis Client Error:', err);
  });
}

module.exports = bruteForceProtection;
