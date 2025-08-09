const { body, param, query, validationResult } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors
    });
  }
  
  next();
};

// User validation rules
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
    
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
    
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    
  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
    
  handleValidationErrors
];

// Product validation rules
const validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Product name must be between 2 and 200 characters'),
    
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
    
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
    
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
    
  body('stock.quantity')
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer'),
    
  handleValidationErrors
];

// Order validation rules
const validateOrder = [
  body('shippingAddress.name')
    .trim()
    .notEmpty()
    .withMessage('Recipient name is required'),
    
  body('shippingAddress.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
    
  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
    
  body('shippingAddress.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
    
  body('shippingAddress.zipCode')
    .matches(/^[0-9]{6}$/)
    .withMessage('Please provide a valid 6-digit ZIP code'),
    
  body('shippingAddress.phone')
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
    
  body('paymentMethod')
    .isIn(['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet', 'cod'])
    .withMessage('Invalid payment method'),
    
  handleValidationErrors
];

// Cart validation rules
const validateCartItem = [
  body('productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
    
  body('quantity')
    .isInt({ min: 1, max: 10 })
    .withMessage('Quantity must be between 1 and 10'),
    
  handleValidationErrors
];

// Review validation rules
const validateReview = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
    
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Review title must be between 3 and 100 characters'),
    
  body('comment')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Review comment must be between 10 and 1000 characters'),
    
  handleValidationErrors
];

// Query parameter validations
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
    
  handleValidationErrors
];

const validateProductFilters = [
  query('category')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Category cannot be empty'),
    
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
    
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),
    
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'price', 'name', 'rating.average', 'popularity'])
    .withMessage('Invalid sort field'),
    
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
    
  handleValidationErrors
];

// ID parameter validation
const validateObjectId = (paramName = 'id') => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName}`),
    
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateProduct,
  validateOrder,
  validateCartItem,
  validateReview,
  validatePagination,
  validateProductFilters,
  validateObjectId
};
