const crypto = require('crypto');

const generateNonce = () => {
  return crypto.randomBytes(16).toString('base64');
};

const secureHeaders = (options = {}) => {
  const defaultOptions = {
    enableHSTS: true,
    enableNoSniff: true,
    enableXSSFilter: true,
    enableFrameGuard: true,
    enableCSP: process.env.NODE_ENV === 'production', 
    reportOnly: false
  };

  const config = { ...defaultOptions, ...options };

  return (req, res, next) => {
    // Generate nonce for CSP
    const nonce = generateNonce();
    res.locals.nonce = nonce;

    // Basic security headers
    const headers = {
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Download-Options': 'noopen',
      'X-Permitted-Cross-Domain-Policies': 'none',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-origin'
    };

    // HSTS
    if (config.enableHSTS && process.env.NODE_ENV === 'production') {
      headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
    }

    // Content Security Policy
    if (config.enableCSP && process.env.NODE_ENV === 'production') {
      const cspDirectives = {
        'default-src': ["'self'"],
        'script-src': [
          "'self'",
          `'nonce-${nonce}'`,
          "'strict-dynamic'",
          'https:', 
          process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ''
        ].filter(Boolean),
        'style-src': ["'self'", 'https:', "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'https:'],
        'font-src': ["'self'", 'https:', 'data:'],
        'connect-src': ["'self'", 'https:'],
        'media-src': ["'self'"],
        'object-src': ["'none'"],
        'frame-src': ["'self'"],
        'frame-ancestors': ["'self'"],
        'form-action': ["'self'"],
        'base-uri': ["'self'"],
        'upgrade-insecure-requests': [],
        'block-all-mixed-content': []
      };

      // Build CSP string
      const cspString = Object.entries(cspDirectives)
        .map(([key, values]) => {
          if (values.length === 0) return key;
          return `${key} ${values.join(' ')}`;
        })
        .join('; ');

      headers[config.reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy'] = cspString;
    }

    // Feature Policy / Permissions Policy
    const permissionsPolicy = {
      'accelerometer': '()',
      'ambient-light-sensor': '()',
      'autoplay': '()',
      'battery': '()',
      'camera': '()',
      'display-capture': '()',
      'document-domain': '()',
      'encrypted-media': '()',
      'execution-while-not-rendered': '()',
      'execution-while-out-of-viewport': '()',
      'fullscreen': '(self)',
      'geolocation': '()',
      'gyroscope': '()',
      'magnetometer': '()',
      'microphone': '()',
      'midi': '()',
      'navigation-override': '()',
      'payment': '()',
      'picture-in-picture': '()',
      'publickey-credentials-get': '()',
      'screen-wake-lock': '()',
      'sync-xhr': '()',
      'usb': '()',
      'web-share': '()',
      'xr-spatial-tracking': '()'
    };

    headers['Permissions-Policy'] = Object.entries(permissionsPolicy)
      .map(([key, value]) => `${key}=${value}`)
      .join(', ');

    // Apply all headers
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    next();
  };
};

module.exports = secureHeaders;
