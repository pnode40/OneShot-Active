/**
 * vCard Generation Utility for OneShot Recruiting Platform
 * Generates downloadable contact cards for prospect camp scenarios
 */

/**
 * Generate vCard content from athlete data
 * @param {Object} athleteData - Athlete profile data
 * @param {string} profileUrl - Full URL to athlete's profile
 * @returns {string} vCard formatted content
 */
function generateVCard(athleteData, profileUrl) {
  const {
    fullName,
    jerseyNumber,
    phone,
    email,
    twitter,
    highSchoolName,
    primaryPosition,
    secondaryPosition,
    graduationYear,
    coachName,
    coachPhone,
    photo,
  } = athleteData;

  // Format positions
  const positions = secondaryPosition
    ? `${primaryPosition} / ${secondaryPosition}`
    : primaryPosition;

  // Format athlete name with jersey
  const athleteNameWithJersey = jerseyNumber
    ? `${fullName} #${jerseyNumber}`
    : fullName;

  // Build vCard content (RFC 6350 standard)
  const vCardContent = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${athleteNameWithJersey}`,
    `N:${fullName.split(' ').reverse().join(';')}`,

    // Athlete contact info
    phone ? `TEL;TYPE=CELL:${phone}` : null,
    email ? `EMAIL:${email}` : null,

    // Organization and role
    `ORG:${highSchoolName}`,
    `TITLE:${positions} - Class of ${graduationYear}`,

    // Social media
    twitter ? `X-TWITTER:${twitter}` : null,

    // Profile photo (if available)
    photo ? `PHOTO;VALUE=URL:${photo}` : null,

    // OneShot profile URL
    `URL:${profileUrl}`,
    `X-ONESHOT-PROFILE:${profileUrl}`,

    // Coach contact (additional contact)
    coachName && coachPhone
      ? `NOTE:Head Coach: ${coachName} - ${coachPhone}`
      : null,

    // OneShot branding
    'X-ONESHOT-PLATFORM:Generated by OneShot Recruiting Platform',
    'PRODID:-//OneShot//OneShot Recruiting Platform//EN',

    'END:VCARD',
  ]
    .filter(line => line !== null) // Remove null lines
    .join('\r\n');

  return vCardContent;
}

/**
 * Generate vCard file data for download
 * @param {Object} athleteData - Athlete profile data
 * @param {string} profileUrl - Full URL to athlete's profile
 * @returns {Object} vCard file data with content and filename
 */
function generateVCardFile(athleteData, profileUrl) {
  const vCardContent = generateVCard(athleteData, profileUrl);
  const fileName = generateVCardFilename(athleteData);

  return {
    content: vCardContent,
    fileName,
    mimeType: 'text/vcard',
    encoding: 'utf8',
  };
}

/**
 * Generate appropriate filename for vCard
 * @param {Object} athleteData - Athlete profile data
 * @returns {string} Safe filename for vCard
 */
function generateVCardFilename(athleteData) {
  const { fullName, jerseyNumber } = athleteData;
  const baseName = fullName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim('-');

  const jerseyPart = jerseyNumber ? `-${jerseyNumber}` : '';
  return `${baseName}${jerseyPart}-contact.vcf`;
}

module.exports = {
  generateVCard,
  generateVCardFile,
  generateVCardFilename,
};
