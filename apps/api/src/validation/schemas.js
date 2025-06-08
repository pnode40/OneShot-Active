const { z } = require('zod');

// Minimal shared validators
const slug = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9-]+$/);

// Minimal validation schemas
const contactSchema = z.object({
  fullName: z.string().min(2).max(100).trim(),
  email: z.string().email().max(255),
  message: z.string().min(10).max(2000).trim(),
  athleteSlug: z.string().optional(),
});

const vcardParamsSchema = z.object({ slug });

module.exports = { contactSchema, vcardParamsSchema };
