const { validateContact, validateVCardParams } = require('./validators');

// Standardized error response format
const sendValidationError = (res, errors) => {
  return res.status(400).json({
    error: 'Validation failed',
    details: errors,
  });
};

// Contact form validation middleware
const validateContactMiddleware = (req, res, next) => {
  const validation = validateContact(req.body);
  if (!validation.success) {
    return sendValidationError(res, validation.errors);
  }
  req.body = validation.data;
  next();
};

// vCard params validation middleware
const validateVCardParamsMiddleware = (req, res, next) => {
  const validation = validateVCardParams(req.params);
  if (!validation.success) {
    return sendValidationError(res, validation.errors);
  }
  req.params = validation.data;
  next();
};

module.exports = {
  validateContactMiddleware,
  validateVCardParamsMiddleware,
};
