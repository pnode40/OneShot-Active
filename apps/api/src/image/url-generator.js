const path = require('path');

/**
 * Generate responsive image URLs for templates
 */
function generateImageUrls(processedImage, athleteSlug) {
  const baseUrl = `/uploads/${athleteSlug}`;

  return {
    thumbnail: processedImage.thumbnail
      ? `${baseUrl}/thumbs/${path.basename(processedImage.thumbnail)}`
      : null,
    mobile: processedImage.mobile
      ? `${baseUrl}/${path.basename(processedImage.mobile)}`
      : `${baseUrl}/${path.basename(processedImage.original)}`,
    desktop: processedImage.desktop
      ? `${baseUrl}/${path.basename(processedImage.desktop)}`
      : `${baseUrl}/${path.basename(processedImage.original)}`,
    original: `${baseUrl}/${path.basename(processedImage.original)}`,
  };
}

module.exports = {
  generateImageUrls,
};
