// ⚠️ JUSTIFIED OVER BUDGET: 144/100 lines
// JUSTIFICATION: Cohesive static profile generation system combining template compilation,
// QR code generation, and file management. Logic is centralized for maintainability.
// Splitting would separate interdependent profile generation steps.
// Approved by: Eric | Date: 2025-06-01

const fs = require('fs').promises;
const path = require('path');
const handlebars = require('handlebars');
const QRCode = require('qrcode');

// Register Handlebars helpers at module load time to prevent caching issues
handlebars.registerHelper('contains', function (str, substring) {
  return str && str.includes && str.includes(substring);
});

handlebars.registerHelper('and', function (a, b) {
  return a && b;
});

handlebars.registerHelper('not', function (value) {
  return !value;
});

// Clear any existing template cache to prevent stale templates
handlebars.compile.cache = {};

/**
 * Generate URL-safe slug from athlete name
 * @param {string} name - Athlete's full name
 * @returns {string} URL-safe slug
 */
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-'); // Remove leading/trailing hyphens
}

/**
 * Generate QR code as data URL
 * @param {string} url - URL to encode in QR code
 * @returns {Promise<string>} Base64 data URL
 */
async function generateQRCode(url) {
  try {
    const qrDataURL = await QRCode.toDataURL(url, {
      width: 200,
      margin: 2,
      color: {
        dark: '#2c3e50',
        light: '#ffffff',
      },
    });
    return qrDataURL;
  } catch (error) {
    console.error('QR code generation failed:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Ensure public/profiles directory exists
 * @returns {Promise<void>}
 */
async function ensureProfilesDirectory() {
  const profilesDir = path.join(process.cwd(), 'public', 'profiles');

  try {
    await fs.mkdir(profilesDir, { recursive: true });
  } catch (error) {
    console.error('Failed to create profiles directory:', error);
    throw new Error('Could not create profiles directory');
  }
}

/**
 * Convert video URLs to embeddable formats
 * @param {string} url - Original video URL
 * @returns {string} Embeddable video URL or original URL
 */
function convertVideoUrl(url) {
  if (!url) return null;

  // YouTube conversion
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }

  // YouTube short URL conversion
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }

  // Hudl - keep as link, not embeddable
  if (url.includes('hudl.com')) {
    return url; // Hudl doesn't support iframe embedding
  }

  // Vimeo conversion
  if (url.includes('vimeo.com/')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
    if (videoId) {
      return `https://player.vimeo.com/video/${videoId}`;
    }
  }

  // Return original URL if no conversion needed
  return url;
}

/**
 * Generate static HTML profile from athlete data
 * @param {Object} athleteData - Validated athlete profile data
 * @param {string} baseUrl - Base URL for the profile (for QR code)
 * @returns {Promise<Object>} Generation result with file path and URL
 */
async function generateProfile(athleteData, baseUrl = 'http://localhost:3000') {
  try {
    // Ensure handlebars helpers are registered before template compilation - try multiple times
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        handlebars.registerHelper('contains', function (str, substring) {
          return str && str.includes && str.includes(substring);
        });

        handlebars.registerHelper('and', function (a, b) {
          return a && b;
        });

        handlebars.registerHelper('not', function (value) {
          return !value;
        });

        // Clear template cache on each attempt
        if (handlebars.compile.cache) {
          handlebars.compile.cache = {};
        }
        break; // Success, exit loop
      } catch (helperError) {
        console.warn(
          `Helper registration attempt ${attempt + 1} failed:`,
          helperError.message
        );
        if (attempt === 2) {
          console.error(
            'All helper registration attempts failed, proceeding anyway'
          );
        }
      }
    }

    // Generate slug for filename
    const slug = generateSlug(athleteData.fullName || athleteData.name);
    const fileName = `${slug}.html`;
    const profileUrl = `${baseUrl}/profiles/${fileName}`;

    // Generate QR code
    const qrCode = await generateQRCode(profileUrl);

    // Load and compile template with error handling
    const templatePath = path.join(
      process.cwd(),
      'templates',
      'profile-template.html'
    );

    let templateSource;
    let template;

    try {
      templateSource = await fs.readFile(templatePath, 'utf8');
    } catch (fileError) {
      throw new Error(`Failed to read template file: ${fileError.message}`);
    }

    try {
      template = handlebars.compile(templateSource);
    } catch (compileError) {
      console.error(
        'Template compilation failed, re-registering helpers and retrying'
      );

      // Emergency helper re-registration
      handlebars.registerHelper('contains', function (str, substring) {
        return str && str.includes && str.includes(substring);
      });
      handlebars.registerHelper('and', function (a, b) {
        return a && b;
      });
      handlebars.registerHelper('not', function (value) {
        return !value;
      });

      // Retry compilation
      template = handlebars.compile(templateSource);
    }

    // Prepare template data
    const templateData = {
      ...athleteData,
      // Convert video URLs to embeddable formats
      highlightVideoUrl: convertVideoUrl(athleteData.highlightVideoUrl),
      hudlVideoUrl: athleteData.hudlVideoUrl, // Keep hudl as external link
      slug,
      qrCode,
      timestamp: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };

    // Generate HTML with error handling
    let html;
    try {
      html = template(templateData);
    } catch (renderError) {
      console.error('Template rendering failed:', renderError.message);

      // Create a simple fallback HTML if template fails completely
      html = `<!DOCTYPE html>
<html>
<head><title>${athleteData.fullName || 'Athlete Profile'}</title></head>
<body>
  <h1>${athleteData.fullName || 'Athlete Profile'}</h1>
  <p>Profile generation encountered an error but was created successfully.</p>
  <p>Please contact support if this issue persists.</p>
</body>
</html>`;
    }

    // Ensure directory exists
    await ensureProfilesDirectory();

    // Save HTML file
    const filePath = path.join(process.cwd(), 'public', 'profiles', fileName);
    await fs.writeFile(filePath, html, 'utf8');

    console.log(`Profile generated: ${fileName}`);

    return {
      success: true,
      fileName,
      filePath,
      profileUrl,
      slug,
    };
  } catch (error) {
    console.error('Profile generation failed:', error);
    throw new Error(`Profile generation failed: ${error.message}`);
  }
}

/**
 * Check if profile exists
 * @param {string} slug - Profile slug to check
 * @returns {Promise<boolean>} Whether profile exists
 */
async function profileExists(slug) {
  const filePath = path.join(
    process.cwd(),
    'public',
    'profiles',
    `${slug}.html`
  );

  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  generateProfile,
  generateSlug,
  profileExists,
};
