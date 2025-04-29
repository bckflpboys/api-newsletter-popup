const winston = require('winston');
const path = require('path');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Write all logs to separate files
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/error.log'), 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/security.log'),
      level: 'warn'
    }),
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/combined.log') 
    })
  ]
});

// If we're not in production, log to console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
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
