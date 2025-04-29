const { body, param, validationResult } = require('express-validator');

// Validation middleware
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({
      status: 'error',
      message: 'Invalid input data',
      errors: errors.array()
    });
  };
};

// Website validation rules
const websiteRules = () => [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('domain')
    .trim()
    .isURL({ require_protocol: false })
    .withMessage('Invalid domain format')
    .customSanitizer(value => value.replace(/^https?:\/\//, ''))
    .customSanitizer(value => value.replace(/\/.*$/, '')),
  body('settings.maxPopupsPerPage')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Max popups per page must be between 1 and 5'),
  body('settings.popupFrequency')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Popup frequency must be at least 1 hour'),
  body('settings.allowMultipleSubscriptions')
    .optional()
    .isBoolean()
    .withMessage('Allow multiple subscriptions must be a boolean')
];

// Popup validation rules
const popupRules = () => [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Description must be between 1 and 1000 characters'),
  body('buttonText')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Button text must be between 1 and 50 characters'),
  body('websiteId')
    .isMongoId()
    .withMessage('Invalid website ID'),
  body('backgroundColor')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Invalid background color format'),
  body('textColor')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Invalid text color format'),
  body('buttonColor')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Invalid button color format'),
  body('buttonTextColor')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Invalid button text color format'),
  body('displayDelay')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Display delay must be a positive number'),
  body('formFields')
    .optional()
    .isObject()
    .withMessage('Form fields must be an object')
];

// Subscriber validation rules
const subscriberRules = () => [
  param('popupId')
    .isMongoId()
    .withMessage('Invalid popup ID'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email address'),
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  body('phone')
    .optional()
    .trim()
    .matches(/^\+?[\d\s-()]{8,20}$/)
    .withMessage('Invalid phone number format'),
  body('city')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('City must be between 1 and 100 characters')
];

module.exports = {
  validate,
  websiteRules,
  popupRules,
  subscriberRules
};
