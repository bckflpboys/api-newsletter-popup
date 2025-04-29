const { logger } = require('./logger');

// Track failed login attempts
const loginAttempts = new Map();

// Track suspicious IP addresses
const suspiciousIPs = new Set();

const securityMonitor = {
  // Monitor failed login attempts
  trackLoginAttempt: (ip, success) => {
    if (!success) {
      const attempts = loginAttempts.get(ip) || 0;
      loginAttempts.set(ip, attempts + 1);

      if (attempts + 1 >= 5) { // 5 failed attempts
        suspiciousIPs.add(ip);
        logger.warn({
          type: 'SECURITY_ALERT',
          message: 'Multiple failed login attempts detected',
          ip,
          attempts: attempts + 1
        });
      }
    } else {
      loginAttempts.delete(ip);
    }
  },

  // Check if IP is suspicious
  isSuspiciousIP: (ip) => {
    return suspiciousIPs.has(ip);
  },

  // Monitor suspicious patterns
  checkRequestPattern: (req) => {
    const patterns = {
      sqlInjection: /(union|select|insert|drop|delete|update|create|alter)/gi,
      xss: /(<script|javascript:|data:text\/html)/gi,
      pathTraversal: /(\.\.|%2e%2e)/gi
    };

    const requestData = {
      query: JSON.stringify(req.query),
      body: JSON.stringify(req.body),
      params: JSON.stringify(req.params),
      path: req.path
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      for (const [key, value] of Object.entries(requestData)) {
        if (pattern.test(value)) {
          logger.warn({
            type: 'SECURITY_ALERT',
            message: `Potential ${type} attack detected`,
            ip: req.ip,
            path: req.path,
            data: { [key]: value }
          });
          return true;
        }
      }
    }
    return false;
  },

  // Clean up old data (call periodically)
  cleanup: () => {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    loginAttempts.clear();
    suspiciousIPs.clear();
  }
};

// Auto cleanup every hour
setInterval(securityMonitor.cleanup, 60 * 60 * 1000);

module.exports = securityMonitor;
