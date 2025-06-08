const express = require('express');
const { authenticateToken } = require('../auth');
const { generateProfile } = require('../profile-generator');

const router = express.Router();

// Basic validation for profile data
const validateProfileData = data => {
  const errors = [];

  if (!data.fullName || data.fullName.length < 2) {
    errors.push({
      field: 'fullName',
      message: 'Full name is required (min 2 characters)',
    });
  }
  if (!data.primaryPosition) {
    errors.push({ field: 'primaryPosition', message: 'Position is required' });
  }
  if (!data.highSchoolName) {
    errors.push({
      field: 'highSchoolName',
      message: 'School name is required',
    });
  }

  return { success: errors.length === 0, errors };
};

// Profile generation endpoint (JSON → Static HTML)
router.post('/generate', async (req, res) => {
  try {
    const validation = validateProfileData(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors,
      });
    }

    const athleteData = req.body;
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const result = await generateProfile(athleteData, baseUrl);

    res.status(201).json({
      message: 'Profile generated successfully',
      profile: {
        name: athleteData.fullName,
        slug: result.slug,
        fileName: result.fileName,
        url: result.profileUrl,
      },
      generated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Profile generation error:', error);
    res.status(500).json({
      error: 'Failed to generate profile',
      message: error.message,
    });
  }
});

// Protected profile creation endpoint (legacy - keeping for compatibility)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const validation = validateProfileData(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors,
      });
    }

    const profileData = {
      ...req.body,
      userId: req.user.id,
      createdAt: new Date().toISOString(),
    };

    res.status(201).json({
      message: 'Profile created successfully',
      profile: profileData,
    });
  } catch (error) {
    console.error('Profile creation error:', error);
    res.status(500).json({
      error: 'Failed to create profile',
      message: error.message,
    });
  }
});

// Generate comprehensive demo profile
router.post('/demo-comprehensive', async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');

    const profileDataPath = path.join(
      process.cwd(),
      'test-data',
      'comprehensive-profile.json'
    );
    const profileData = JSON.parse(fs.readFileSync(profileDataPath, 'utf8'));

    const result = await generateProfile(profileData, 'http://localhost:3000');

    res.json({
      message: 'Comprehensive demo profile generated successfully',
      profile: result,
      previewUrl: result.profileUrl,
      features: [
        'Enhanced player statistics',
        'Player biography section',
        'Highlight videos with thumbnails',
        'Achievements and awards',
        'Coach testimonials',
        'Professional photo display',
        'Document downloads',
        'Mobile-optimized design',
      ],
    });
  } catch (error) {
    console.error('Demo profile generation failed:', error);
    res.status(500).json({
      error: 'Failed to generate demo profile',
      details: error.message,
    });
  }
});

module.exports = router;
