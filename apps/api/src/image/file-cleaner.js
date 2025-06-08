const fs = require('fs').promises;
const path = require('path');
const { SUPPORTED_FORMATS } = require('./config');

/**
 * Check if file is a supported image format
 */
function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase().slice(1);
  return SUPPORTED_FORMATS.includes(ext);
}

/**
 * Clean up old image files when replacing
 */
async function cleanupOldImages(uploadDir, keepFiles = []) {
  try {
    await cleanDirectory(uploadDir, keepFiles);
    await cleanThumbnailDirectory(path.join(uploadDir, 'thumbs'), keepFiles);
  } catch (error) {
    console.warn(`Cleanup warning: ${error.message}`);
  }
}

/**
 * Clean main upload directory
 */
async function cleanDirectory(uploadDir, keepFiles) {
  const files = await fs.readdir(uploadDir);

  for (const file of files) {
    if (file === 'thumbs') continue;

    const filePath = path.join(uploadDir, file);
    const stat = await fs.stat(filePath);

    if (stat.isFile() && !keepFiles.includes(file) && isImageFile(file)) {
      await fs.unlink(filePath);
    }
  }
}

/**
 * Clean thumbnail directory
 */
async function cleanThumbnailDirectory(thumbDir, keepFiles) {
  try {
    const thumbFiles = await fs.readdir(thumbDir);

    for (const file of thumbFiles) {
      const filePath = path.join(thumbDir, file);
      const shouldKeep = keepFiles.some(keep =>
        file.includes(path.basename(keep, path.extname(keep)))
      );

      if (!shouldKeep) {
        await fs.unlink(filePath);
      }
    }
  } catch {
    // Thumbs directory might not exist yet
  }
}

module.exports = {
  cleanupOldImages,
  isImageFile,
};
