require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const { logger } = require('./utils/logger');
const routes = require('./routes');
const securityMonitor = require('./utils/securityMonitor');
const requestSanitizer = require('./middleware/requestSanitizer');
const bruteForceProtection = require('./middleware/bruteForceProtection');
const secureHeaders = require('./middleware/secureHeaders');

// Custom error handler
const errorHandler = (err, req, res, next) => {
  logger.error('Error:', err);
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(409).json({
      status: 'error',
      message: 'Duplicate entry found'
    });
  }

  // Default error
  res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message
  });
};

const app = express();

// CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:5173').split(',');
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn('CORS violation attempt from origin:', { origin });
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Middleware
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize());

// Security middleware
app.use(secureHeaders({
  enableHSTS: process.env.NODE_ENV === 'production',
  enableCSP: true,
  reportOnly: process.env.NODE_ENV === 'development'
}));

app.use(bruteForceProtection);
app.use(requestSanitizer);

// Security monitoring
app.use((req, res, next) => {
  if (securityMonitor.isSuspiciousIP(req.ip)) {
    logger.warn('Suspicious IP detected:', req.ip);
  }
  next();
});

// Connect to MongoDB
connectDB();

// Mount routes with proper prefix
app.use('/api', routes);

// Add request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Error handling middleware
app.use(errorHandler);

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
    const PORT = process.env.PORT || 3003;
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error('MongoDB connection error:', error);
  });
