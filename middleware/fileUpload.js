const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Allowed file types
const ALLOWED_FILE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf'
]);

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Generate secure filename
const generateSecureFilename = (originalname) => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(16).toString('hex');
  const extension = path.extname(originalname);
  return `${timestamp}-${randomString}${extension}`;
};

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, generateSecureFilename(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (!ALLOWED_FILE_TYPES.has(file.mimetype)) {
    cb(new Error('Invalid file type'), false);
    return;
  }

  // Scan file content to verify it matches its extension
  const fileTypeCheck = true; // Implement actual file type checking
  if (!fileTypeCheck) {
    cb(new Error('File content does not match extension'), false);
    return;
  }

  cb(null, true);
};

// Create multer instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter: fileFilter
});

// Virus scanning middleware
const scanFile = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    // Implement virus scanning here
    // For example, using ClamAV or a cloud-based service
    const isSafe = true; // Replace with actual virus scan
    
    if (!isSafe) {
      // Delete the uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: 'File failed security scan'
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  upload,
  scanFile
};
