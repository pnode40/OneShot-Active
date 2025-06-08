const { contactSchema, vcardParamsSchema } = require('./schemas');

// Standardized validation result format
const createValidationResult = (success, data = null, errors = null) => ({
  success,
  data,
  errors,
});

// Contact form validation
const validateContact = data => {
  try {
    const validated = contactSchema.parse(data);
    return createValidationResult(true, validated);
  } catch (error) {
    const errors = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    return createValidationResult(false, null, errors);
  }
};

// vCard params validation
const validateVCardParams = params => {
  try {
    const validated = vcardParamsSchema.parse(params);
    return createValidationResult(true, validated);
  } catch (error) {
    const errors = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    return createValidationResult(false, null, errors);
  }
};

module.exports = { validateContact, validateVCardParams };
