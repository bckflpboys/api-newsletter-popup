const crypto = require('crypto');
const mongoose = require('mongoose');

// API Key Schema
const apiKeySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  },
  lastUsed: Date,
  isActive: {
    type: Boolean,
    default: true
  }
});

const ApiKey = mongoose.model('ApiKey', apiKeySchema);

// Generate new API key
const generateApiKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Create new API key
const createApiKey = async (name, expiresInDays = 90) => {
  const key = generateApiKey();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);

  const apiKey = new ApiKey({
    key,
    name,
    expiresAt
  });

  await apiKey.save();
  return apiKey;
};

// Rotate API key
const rotateApiKey = async (oldKeyId) => {
  const oldKey = await ApiKey.findById(oldKeyId);
  if (!oldKey) {
    throw new Error('API key not found');
  }

  // Create new key
  const newKey = await createApiKey(oldKey.name);

  // Deactivate old key but keep it for audit purposes
  oldKey.isActive = false;
  await oldKey.save();

  return newKey;
};

// Validate API key
const validateApiKey = async (key) => {
  const apiKey = await ApiKey.findOne({ key, isActive: true });
  
  if (!apiKey) {
    return false;
  }

  // Check if expired
  if (apiKey.expiresAt < new Date()) {
    apiKey.isActive = false;
    await apiKey.save();
    return false;
  }

  // Update last used timestamp
  apiKey.lastUsed = new Date();
  await apiKey.save();

  return true;
};

// API key middleware
const apiKeyAuth = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }

  const isValid = await validateApiKey(apiKey);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid or expired API key' });
  }

  next();
};

// Cleanup expired keys
const cleanupExpiredKeys = async () => {
  const result = await ApiKey.updateMany(
    { expiresAt: { $lt: new Date() }, isActive: true },
    { $set: { isActive: false } }
  );
  return result.modifiedCount;
};

module.exports = {
  createApiKey,
  rotateApiKey,
  validateApiKey,
  apiKeyAuth,
  cleanupExpiredKeys
};
