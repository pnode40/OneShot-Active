const express = require('express');
const { validateVCardParamsMiddleware } = require('../validation');
const { upload } = require('../file-upload');
const { processImage, generateImageUrls } = require('../image');

const router = express.Router();

// File upload endpoint with slug validation
router.post(
  '/:slug',
  validateVCardParamsMiddleware,
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'transcript', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { slug: athleteSlug } = req.params;
      const files = req.files;

      // Basic file validation (files are optional)
      if (!files || (!files.photo && !files.transcript)) {
        return res.status(400).json({
          error: 'No files provided',
          details: [
            { field: 'files', message: 'At least one file must be uploaded' },
          ],
        });
      }

      const result = {
        slug: athleteSlug,
        uploadedFiles: {},
        processedImages: {},
        uploadUrls: {},
      };

      // Process uploaded photo
      if (files.photo && files.photo[0]) {
        const photoFile = files.photo[0];

        try {
          // Process image for web optimization
          const processedImage = await processImage(
            photoFile.path,
            athleteSlug
          );
          const imageUrls = generateImageUrls(processedImage, athleteSlug);

          result.uploadedFiles.photo = {
            originalName: photoFile.originalname,
            filename: photoFile.filename,
            size: photoFile.size,
            mimetype: photoFile.mimetype,
          };

          result.processedImages.photo = processedImage;
          result.uploadUrls.photo = imageUrls;

          console.log(
            `✅ Photo processed for ${athleteSlug}: ${photoFile.filename}`
          );
        } catch (error) {
          console.error('Photo processing error:', error);
          return res.status(500).json({
            error: 'Photo processing failed',
            message: error.message,
          });
        }
      }

      // Handle transcript upload
      if (files.transcript && files.transcript[0]) {
        const transcriptFile = files.transcript[0];

        result.uploadedFiles.transcript = {
          originalName: transcriptFile.originalname,
          filename: transcriptFile.filename,
          size: transcriptFile.size,
          mimetype: transcriptFile.mimetype,
        };

        result.uploadUrls.transcript = `/uploads/${athleteSlug}/${transcriptFile.filename}`;

        console.log(
          `✅ Transcript uploaded for ${athleteSlug}: ${transcriptFile.filename}`
        );
      }

      res.status(200).json({
        message: 'Files uploaded successfully',
        ...result,
        uploadedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({
        error: 'File upload failed',
        message: error.message,
      });
    }
  }
);

module.exports = router;
