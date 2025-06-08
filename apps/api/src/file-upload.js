// ⚠️ JUSTIFIED OVER BUDGET: 161/80 lines
// JUSTIFICATION: Cohesive file upload system with security, validation, and multer config.
// Splitting would create artificial separation of tightly coupled upload logic.
// All functionality is logically related and frequently modified together.
// Approved by: Eric | Date: 2025-06-01

// ✅ server/file-upload.js
// Complete File Upload System with Validation and Security

const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');

// File type configurations
const ALLOWED_IMAGES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_DOCUMENTS = ['application/pdf'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Generate unique filename with timestamp and hash
 */
function generateUniqueFilename(originalName, athleteSlug) {
  const timestamp = Date.now();
  const extension = path.extname(originalName).toLowerCase();
  const hash = crypto.randomBytes(8).toString('hex');
  const baseName = path
    .basename(originalName, extension)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-');
  return `${athleteSlug}-${baseName}-${timestamp}-${hash}${extension}`;
}

/**
 * Validate file type and security
 */
function validateFile(file, fieldName) {
  const errors = [];

  // Check field-specific requirements
  if (fieldName === 'photo') {
    if (!ALLOWED_IMAGES.includes(file.mimetype)) {
      errors.push('Photo must be JPEG, PNG, or WebP format');
    }
    if (file.size > MAX_IMAGE_SIZE) {
      errors.push('Photo must be less than 5MB');
    }
  } else if (fieldName === 'transcript') {
    if (!ALLOWED_DOCUMENTS.includes(file.mimetype)) {
      errors.push('Transcript must be PDF format');
    }
    if (file.size > MAX_DOCUMENT_SIZE) {
      errors.push('Transcript must be less than 10MB');
    }
  }

  // Basic security checks
  const filename = file.originalname.toLowerCase();
  const dangerousExtensions = [
    '.exe',
    '.bat',
    '.cmd',
    '.scr',
    '.com',
    '.pif',
    '.vbs',
    '.js',
    '.jar',
  ];
  if (dangerousExtensions.some(ext => filename.endsWith(ext))) {
    errors.push('File type not allowed for security reasons');
  }

  return errors;
}

/**
 * Create upload directory structure
 */
async function ensureUploadDirectories(athleteSlug) {
  const uploadDir = path.join(__dirname, '../../public/uploads', athleteSlug);
  const thumbDir = path.join(uploadDir, 'thumbs');

  try {
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.mkdir(thumbDir, { recursive: true });
    return uploadDir;
  } catch (error) {
    throw new Error(`Failed to create upload directories: ${error.message}`);
  }
}

/**
 * Handle duplicate files
 */
async function handleDuplicateFile(filePath) {
  try {
    await fs.access(filePath);
    // File exists, create backup
    const timestamp = Date.now();
    const extension = path.extname(filePath);
    const baseName = path.basename(filePath, extension);
    const directory = path.dirname(filePath);
    const backupPath = path.join(
      directory,
      `${baseName}-backup-${timestamp}${extension}`
    );
    await fs.rename(filePath, backupPath);
    return backupPath;
  } catch {
    // File doesn't exist, no duplicate
    return null;
  }
}

/**
 * Configure multer for file uploads
 */
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const athleteSlug = req.params.slug;
      const uploadDir = await ensureUploadDirectories(athleteSlug);
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    try {
      const athleteSlug = req.params.slug;
      const uniqueName = generateUniqueFilename(file.originalname, athleteSlug);
      cb(null, uniqueName);
    } catch (error) {
      cb(error);
    }
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_DOCUMENT_SIZE, // Use larger limit, individual validation handles specifics
    files: 2, // Max 2 files (photo + transcript)
  },
  fileFilter: (req, file, cb) => {
    const errors = validateFile(file, file.fieldname);
    if (errors.length > 0) {
      cb(new Error(errors.join('. ')));
    } else {
      cb(null, true);
    }
  },
});

module.exports = {
  upload,
  validateFile,
  ensureUploadDirectories,
  handleDuplicateFile,
  generateUniqueFilename,
  ALLOWED_IMAGES,
  ALLOWED_DOCUMENTS,
  MAX_IMAGE_SIZE,
  MAX_DOCUMENT_SIZE,
};
