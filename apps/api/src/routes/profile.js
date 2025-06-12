const express = require('express');
const QRCode = require('qrcode');
const { generateProfile, profileExists } = require('../profile-generator');

const router = express.Router();

// In-memory data store for profiles (in a real app, this would be a database)
let profiles = [
  {
    id: '1',
    fullName: 'Jordan Davis',
    primaryPosition: 'Quarterback',
    highSchoolName: 'Lincoln High',
    graduationYear: 2024,
    userId: 'user123',
    createdAt: '2023-09-01T12:00:00Z',
    slug: 'jordan-davis',
    public: true
  },
  {
    id: '2',
    fullName: 'Riley Smith',
    primaryPosition: 'Wide Receiver',
    highSchoolName: 'Westview Academy',
    graduationYear: 2025,
    userId: 'user456',
    createdAt: '2023-10-15T14:30:00Z',
    slug: 'riley-smith',
    public: false
  }
];

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

// GET all profiles (public only)
router.get('/', async (req, res) => {
  try {
    // Optional filtering by query parameters
    const { position, school, year } = req.query;
    
    // Start with public profiles only
    let filteredProfiles = profiles.filter(p => p.public === true);
    
    if (position) {
      filteredProfiles = filteredProfiles.filter(p => 
        p.primaryPosition && p.primaryPosition.toLowerCase().includes(position.toLowerCase())
      );
    }
    
    if (school) {
      filteredProfiles = filteredProfiles.filter(p => 
        p.highSchoolName && p.highSchoolName.toLowerCase().includes(school.toLowerCase())
      );
    }
    
    if (year) {
      filteredProfiles = filteredProfiles.filter(p => 
        p.graduationYear && p.graduationYear.toString() === year
      );
    }
    
    res.json({
      count: filteredProfiles.length,
      profiles: filteredProfiles
    });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({
      error: 'Failed to retrieve profiles',
      message: error.message
    });
  }
});

// GET profile by ID (public only)
router.get('/:id', async (req, res) => {
  try {
    const profile = profiles.find(p => p.id === req.params.id);
    
    if (!profile || profile.public !== true) {
      return res.status(404).json({
        error: 'Profile not found',
        message: 'This profile does not exist or is not publicly accessible'
      });
    }
    
    // Check if this profile has a generated HTML file
    const profileHasHtml = await profileExists(profile.slug);
    
    res.json({
      profile,
      hasGeneratedHtml: profileHasHtml,
      htmlUrl: profileHasHtml ? `/profiles/${profile.slug}.html` : null
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      error: 'Failed to retrieve profile',
      message: error.message
    });
  }
});

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

// Public profile creation endpoint (removed authentication for testing)
router.post('/', async (req, res) => {
  try {
    const validation = validateProfileData(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors,
      });
    }

    // Create a new profile with a unique ID
    const newId = (profiles.length + 1).toString();
    const slug = req.body.fullName ? req.body.fullName.toLowerCase().replace(/\s+/g, '-') : `profile-${newId}`;

    const profileData = {
      id: newId,
      ...req.body,
      userId: 'test-user', // Hardcoded for testing
      createdAt: new Date().toISOString(),
      slug,
      public: req.body.public ?? true // Default to public if not specified
    };
    
    // Add to in-memory store
    profiles.push(profileData);

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

// QR Code generation endpoint
router.get('/:id/qr', async (req, res) => {
  try {
    const profile = profiles.find(p => p.id === req.params.id);
    
    if (!profile) {
      return res.status(404).json({
        error: 'Profile not found',
        message: `No profile found with ID: ${req.params.id}`
      });
    }

    // Determine the frontend URL for the profile
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const profileUrl = `${frontendUrl}/athlete/${profile.id}`;
    
    // QR code options for better quality
    const qrOptions = {
      type: 'png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 256
    };

    // Generate QR code as base64 data URL
    const qrCodeDataURL = await QRCode.toDataURL(profileUrl, qrOptions);
    
    // Generate QR code as buffer for potential file downloads
    // eslint-disable-next-line no-unused-vars
    const qrCodeBuffer = await QRCode.toBuffer(profileUrl, qrOptions);

    res.json({
      message: 'QR code generated successfully',
      profile: {
        id: profile.id,
        name: profile.fullName,
        slug: profile.slug
      },
      qrCode: {
        dataURL: qrCodeDataURL,
        profileUrl: profileUrl,
        format: 'PNG',
        size: '256x256',
        downloadUrl: `/api/profiles/${profile.id}/qr/download`
      },
      usage: {
        description: 'Scan this QR code to view the athlete profile',
        instructions: 'Point your phone camera or QR scanner at the code'
      }
    });
  } catch (error) {
    console.error('QR code generation error:', error);
    res.status(500).json({
      error: 'Failed to generate QR code',
      message: error.message
    });
  }
});

// QR Code download endpoint (returns actual image file)
router.get('/:id/qr/download', async (req, res) => {
  try {
    const profile = profiles.find(p => p.id === req.params.id);
    
    if (!profile) {
      return res.status(404).json({
        error: 'Profile not found'
      });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const profileUrl = `${frontendUrl}/athlete/${profile.id}`;
    
    const qrOptions = {
      type: 'png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 512 // Higher resolution for download
    };

    const qrCodeBuffer = await QRCode.toBuffer(profileUrl, qrOptions);
    
    // Set proper headers for image download
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="qr-code-${profile.slug}.png"`);
    res.setHeader('Content-Length', qrCodeBuffer.length);
    
    res.send(qrCodeBuffer);
  } catch (error) {
    console.error('QR code download error:', error);
    res.status(500).json({
      error: 'Failed to download QR code',
      message: error.message
    });
  }
});

module.exports = router;
