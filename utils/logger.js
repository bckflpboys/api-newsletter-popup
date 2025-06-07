const winston = require('winston');
const path = require('path');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info', // Allow configuring log level via env var
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }), // Log stack traces for errors
    winston.format.json()
  ),
  transports: [
    // Always log to console. Vercel will pick this up.
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Optional: for colored output locally
        winston.format.simple()
      )
    })
  ]
});

// Only add file transports if NOT in production (e.g., for local development)
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.File({ 
    filename: path.join(__dirname, '../logs/error.log'), 
    level: 'error' 
  }));
  logger.add(new winston.transports.File({ 
    filename: path.join(__dirname, '../logs/security.log'),
    level: 'warn' // Or a custom level for security if you define one
  }));
  logger.add(new winston.transports.File({ 
    filename: path.join(__dirname, '../logs/combined.log') 
  }));
  
  // Ensure logs directory exists for local development
  const fs = require('fs');
  const logsDir = path.join(__dirname, '../logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
  }
}

// Security event logging functions
const logSecurityEvent = (event, details) => {
  logger.warn({
    type: 'SECURITY_EVENT',
    event,
    details,
    timestamp: new Date().toISOString()
  });
};

const logAuthAttempt = (success, userId, ip) => {
  logger.info({
    type: 'AUTH_ATTEMPT',
    success,
    userId,
    ip,
    timestamp: new Date().toISOString()
  });
};

const logFailedValidation = (endpoint, errors, ip) => {
  logger.warn({
    type: 'VALIDATION_FAILURE',
    endpoint,
    errors,
    ip,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  logger,
  logSecurityEvent,
  logAuthAttempt,
  logFailedValidation
};
