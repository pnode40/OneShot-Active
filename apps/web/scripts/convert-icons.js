const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const publicDir = path.join(__dirname, '../public');

async function convertSvgToPng(inputFile, outputFile, size) {
  try {
    const svgBuffer = fs.readFileSync(path.join(publicDir, inputFile));
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, outputFile));
    console.log(`✅ Generated ${outputFile}`);
  } catch (error) {
    console.error(`❌ Error generating ${outputFile}:`, error);
  }
}

async function main() {
  // Create icons directory if it doesn't exist
  const iconsDir = path.join(publicDir, 'icons');
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir);
  }

  // Convert icons
  await convertSvgToPng('icon-192.svg', 'icon-192.png', 192);
  await convertSvgToPng('icon-512.svg', 'icon-512.png', 512);
}

main().catch(console.error); 