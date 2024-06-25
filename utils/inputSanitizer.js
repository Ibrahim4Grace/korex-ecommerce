const validator = require('validator');

// Helper function to trim and sanitize input
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    input = validator.trim(input);
    input = validator.escape(input);
  }
  return input;
};

const sanitizeObject = (obj) => {
  const sanitizedObj = {};
  Object.keys(obj).forEach((key) => {
    sanitizedObj[key] = sanitizeInput(obj[key]);
  });
  return sanitizedObj;
};

module.exports = { sanitizeInput, sanitizeObject };
