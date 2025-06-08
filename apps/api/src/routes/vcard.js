const express = require('express');
const router = express.Router();
const { generateVCardFile } = require('../vcard-generator');
const { validateVCardParamsMiddleware } = require('../validation');
const fs = require('fs').promises;
const path = require('path');

/**
 * Generate and download vCard for athlete
 * GET /api/vcard/:slug
 */
router.get('/:slug', validateVCardParamsMiddleware, async (req, res) => {
  try {
    const { slug } = req.params;

    // Load athlete data (in production, this would come from database)
    const testDataPath = path.join(
      process.cwd(),
      'test-data',
      'comprehensive-profile.json'
    );
    const athleteData = JSON.parse(await fs.readFile(testDataPath, 'utf8'));

    // Generate profile URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const profileUrl = `${baseUrl}/profiles/${slug}.html`;

    // Generate vCard
    const vCardFile = generateVCardFile(athleteData, profileUrl);

    // Set response headers for download
    res.set({
      'Content-Type': vCardFile.mimeType,
      'Content-Disposition': `attachment; filename="${vCardFile.fileName}"`,
      'Cache-Control': 'no-cache',
      'X-OneShot-Type': 'vcard-download',
    });

    // Send vCard content
    res.send(vCardFile.content);
  } catch (error) {
    console.error('vCard generation failed:', error);
    res.status(500).json({
      error: 'Failed to generate vCard',
      message: error.message,
    });
  }
});

/**
 * Preview vCard content (for debugging)
 * GET /api/vcard/:slug/preview
 */
router.get(
  '/:slug/preview',
  validateVCardParamsMiddleware,
  async (req, res) => {
    try {
      const { slug } = req.params;

      // Load athlete data
      const testDataPath = path.join(
        process.cwd(),
        'test-data',
        'comprehensive-profile.json'
      );
      const athleteData = JSON.parse(await fs.readFile(testDataPath, 'utf8'));

      // Generate profile URL
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const profileUrl = `${baseUrl}/profiles/${slug}.html`;

      // Generate vCard
      const vCardFile = generateVCardFile(athleteData, profileUrl);

      // Return preview as JSON
      res.json({
        fileName: vCardFile.fileName,
        content: vCardFile.content,
        profileUrl,
        athlete: {
          name: athleteData.fullName,
          jersey: athleteData.jerseyNumber,
          school: athleteData.highSchoolName,
        },
      });
    } catch (error) {
      console.error('vCard preview failed:', error);
      res.status(500).json({
        error: 'Failed to preview vCard',
        message: error.message,
      });
    }
  }
);

module.exports = router;
