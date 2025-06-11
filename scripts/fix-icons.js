const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// SVG content for the icons
const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="512" height="512" fill="#2C3E50" rx="64"/>
  
  <!-- ONE Text -->
  <g font-family="Arial, sans-serif" font-weight="bold" text-anchor="middle">
    <!-- O -->
    <text x="128" y="320" font-size="170" fill="white">O</text>
    <!-- N -->
    <text x="256" y="320" font-size="170" fill="white">N</text>
    <!-- 1 (styled in blue) -->
    <text x="320" y="320" font-size="170" fill="#00C2FF">1</text>
    <!-- E -->
    <text x="384" y="320" font-size="170" fill="white">E</text>
  </g>
</svg>`;

async function generateIcons() {
  try {
    const publicDir = path.join(__dirname, '..', 'apps', 'web', 'public');
    
    // Generate 192x192 icon
    await sharp(Buffer.from(svgContent))
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'icon-192-proper.png'));
    
    // Generate 512x512 icon
    await sharp(Buffer.from(svgContent))
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'icon-512-proper.png'));
    
    console.log('✅ Generated PNG icons successfully');
    console.log('📁 Location:', publicDir);
    console.log('📋 Files created:');
    console.log('   - icon-192-proper.png');
    console.log('   - icon-512-proper.png');
    console.log('\n⚠️  Note: Rename these files to icon-192.png and icon-512.png after backup');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    console.log('\n💡 Make sure sharp is installed: npm install sharp');
  }
}

generateIcons(); 