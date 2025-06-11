const fs = require('fs');
const path = require('path');

// Simple PNG creation without external dependencies
// Using a minimal PNG implementation
function createSimplePng(width, height, color) {
    // PNG signature
    const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    
    // IHDR chunk
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8; // bit depth
    ihdr[9] = 2; // color type (RGB)
    ihdr[10] = 0; // compression
    ihdr[11] = 0; // filter
    ihdr[12] = 0; // interlace
    
    // Create image data (solid color)
    const scanlineBytes = width * 3 + 1;
    const imageData = Buffer.alloc(height * scanlineBytes);
    
    for (let y = 0; y < height; y++) {
        const offset = y * scanlineBytes;
        imageData[offset] = 0; // filter type
        for (let x = 0; x < width; x++) {
            const pixelOffset = offset + 1 + x * 3;
            imageData[pixelOffset] = color.r;
            imageData[pixelOffset + 1] = color.g;
            imageData[pixelOffset + 2] = color.b;
        }
    }
    
    // Compress with zlib
    const zlib = require('zlib');
    const compressed = zlib.deflateSync(imageData);
    
    // Create chunks
    function createChunk(type, data) {
        const length = Buffer.alloc(4);
        length.writeUInt32BE(data.length, 0);
        const typeBuffer = Buffer.from(type, 'ascii');
        const crc = calculateCrc(Buffer.concat([typeBuffer, data]));
        const crcBuffer = Buffer.alloc(4);
        crcBuffer.writeUInt32BE(crc, 0);
        return Buffer.concat([length, typeBuffer, data, crcBuffer]);
    }
    
    // Simple CRC calculation
    function calculateCrc(data) {
        let crc = 0xffffffff;
        for (let i = 0; i < data.length; i++) {
            crc ^= data[i];
            for (let j = 0; j < 8; j++) {
                crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
            }
        }
        return crc ^ 0xffffffff;
    }
    
    // Build PNG
    const chunks = [
        signature,
        createChunk('IHDR', ihdr),
        createChunk('IDAT', compressed),
        createChunk('IEND', Buffer.alloc(0))
    ];
    
    return Buffer.concat(chunks);
}

// Create icons
const publicDir = path.join(__dirname, '..', 'apps', 'web', 'public');

// OneShot brand color
const brandColor = { r: 44, g: 62, b: 80 }; // #2C3E50

// Create 192x192 icon
const icon192 = createSimplePng(192, 192, brandColor);
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), icon192);
console.log('Created icon-192.png (192x192 real PNG)');

// Create 512x512 icon
const icon512 = createSimplePng(512, 512, brandColor);
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), icon512);
console.log('Created icon-512.png (512x512 real PNG)');

console.log('\n✅ Real PNG icons created successfully!'); 