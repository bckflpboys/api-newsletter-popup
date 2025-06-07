const mongoose = require('mongoose');
const { logger } = require('../utils/logger');
const mongoSanitize = require('express-mongo-sanitize');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

// Initialize MongoDB connection
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    cachedDb = db;
    return db;
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    throw error;
  }
}

// Middleware wrapper for serverless functions
const withMiddleware = (handler) => async (req, res) => {
  try {
    // Connect to database
    await connectToDatabase();

    // Apply security middleware
    req.body = mongoSanitize.sanitize(req.body);

    // Add CORS headers
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:5173').split(',');
    const origin = req.headers.origin;

    if (!origin || allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin || '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    } else {
      logger.warn('CORS violation attempt from origin:', { origin });
      return res.status(403).json({ error: 'Not allowed by CORS' });
    }

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // --- START CLERK AUTHENTICATION ---
    const authMiddleware = ClerkExpressRequireAuth(); // Using default options
    await new Promise((resolve, reject) => {
      authMiddleware(req, res, (err) => { // err is the argument to next(err)
        if (err) {
          // Clerk middleware indicated an error (e.g., misconfiguration)
          // This will be caught by the outer try/catch in withMiddleware
          return reject(err);
        }
        // If no error, Clerk middleware either sent a response (401/403 for auth failure)
        // or called next() (auth success, req.auth populated).
        resolve(undefined);
      });
    });

    // If Clerk middleware sent a response (e.g., 401 Unauthorized), stop further processing.
    if (res.headersSent) {
      return;
    }
    // --- END CLERK AUTHENTICATION ---
    // If we reach here, authentication was successful and req.auth is populated.

    // Execute the handler
    return await handler(req, res);
  } catch (error) {
    logger.error('API Error:', error);
    return res.status(500).json({
      status: 'error',
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : error.message
    });
  }
};

module.exports = { withMiddleware };