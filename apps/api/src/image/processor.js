const sharp = require('sharp');
const path = require('path');
const {
  THUMBNAIL_SIZE,
  MOBILE_SIZE,
  DESKTOP_SIZE,
  QUALITY,
  OUTPUT_FORMAT,
} = require('./config');

/**
 * Resize image to specified dimensions
 */
async function resizeImage(
  inputPath,
  outputPath,
  width,
  height = null,
  options = {}
) {
  const image = sharp(inputPath);

  return image
    .resize(width, height, {
      withoutEnlargement: true,
      fit: options.fit || 'inside',
      position: options.position || 'center',
      ...options,
    })
    .webp({ quality: QUALITY })
    .toFile(outputPath);
}

/**
 * Process uploaded image into multiple responsive sizes
 */
async function processImage(imagePath) {
  const image = sharp(imagePath);
  const metadata = await image.metadata();

  const baseDir = path.dirname(imagePath);
  const baseName = path.basename(imagePath, path.extname(imagePath));

  const results = {
    original: imagePath,
    thumbnail: null,
    mobile: null,
    desktop: null,
    metadata: {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: metadata.size,
    },
  };

  // Generate thumbnail (always)
  const thumbnailPath = path.join(
    baseDir,
    'thumbs',
    `${baseName}-thumb.${OUTPUT_FORMAT}`
  );
  await resizeImage(imagePath, thumbnailPath, THUMBNAIL_SIZE, THUMBNAIL_SIZE, {
    fit: 'cover',
    position: 'center',
  });
  results.thumbnail = thumbnailPath;

  // Generate mobile version (if needed)
  if (metadata.width > MOBILE_SIZE) {
    const mobilePath = path.join(
      baseDir,
      `${baseName}-mobile.${OUTPUT_FORMAT}`
    );
    await resizeImage(imagePath, mobilePath, MOBILE_SIZE);
    results.mobile = mobilePath;
  }

  // Generate desktop version (if needed)
  if (metadata.width > DESKTOP_SIZE) {
    const desktopPath = path.join(
      baseDir,
      `${baseName}-desktop.${OUTPUT_FORMAT}`
    );
    await resizeImage(imagePath, desktopPath, DESKTOP_SIZE);
    results.desktop = desktopPath;
  }

  return results;
}

module.exports = {
  processImage,
  resizeImage,
};
