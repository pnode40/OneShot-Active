// Public API for image processing module
const { processImage } = require('./processor');
const { generateImageUrls } = require('./url-generator');
const { cleanupOldImages } = require('./file-cleaner');
const config = require('./config');

// Enhanced processImage with error handling
async function processImageSafely(imagePath, athleteSlug) {
  try {
    return await processImage(imagePath, athleteSlug);
  } catch (error) {
    throw new Error(`Image processing failed: ${error.message}`);
  }
}

module.exports = {
  processImage: processImageSafely,
  generateImageUrls,
  cleanupOldImages,
  ...config,
};
