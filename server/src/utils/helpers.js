const crypto = require('crypto');

const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `NS${timestamp.slice(-6)}${random}`;
};

const generateSKU = (category, name) => {
  const categoryCode = category.substring(0, 3).toUpperCase();
  const nameCode = name.replace(/\s+/g, '').substring(0, 3).toUpperCase();
  const timestamp = Date.now().toString().slice(-6);
  return `${categoryCode}-${nameCode}-${timestamp}`;
};

const calculateDiscount = (originalPrice, salePrice) => {
  if (!originalPrice || !salePrice || originalPrice <= salePrice) {
    return 0;
  }
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 6 characters
  return password && password.length >= 6;
};

const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/; // Indian phone number format
  return phoneRegex.test(phone);
};

const generateHash = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

const paginate = (array, page_size, page_number) => {
  return array.slice((page_number - 1) * page_size, page_number * page_size);
};

const capitalizeWords = (str) => {
  return str.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

const sanitizeHtml = (html) => {
  // Basic HTML sanitization (use a proper library like DOMPurify in production)
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '');
};

const parseSearchQuery = (query) => {
  const filters = {};
  const terms = [];
  
  const parts = query.split(' ');
  
  parts.forEach(part => {
    if (part.includes(':')) {
      const [key, value] = part.split(':');
      filters[key] = value;
    } else {
      terms.push(part);
    }
  });
  
  return { filters, terms: terms.join(' ') };
};

const generateMetaDescription = (text, maxLength = 160) => {
  const clean = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return truncateText(clean, maxLength);
};

const isValidObjectId = (id) => {
  const ObjectId = require('mongoose').Types.ObjectId;
  return ObjectId.isValid(id);
};

const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase();
};

const isImageFile = (filename) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const extension = getFileExtension(filename);
  return imageExtensions.includes(extension);
};

const convertToWebP = async (buffer) => {
  const sharp = require('sharp');
  return await sharp(buffer)
    .webp({ quality: 80 })
    .toBuffer();
};

const createThumbnail = async (buffer, width = 300, height = 300) => {
  const sharp = require('sharp');
  return await sharp(buffer)
    .resize(width, height, { fit: 'cover' })
    .jpeg({ quality: 80 })
    .toBuffer();
};

module.exports = {
  generateOrderNumber,
  generateSKU,
  calculateDiscount,
  formatCurrency,
  slugify,
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  generateHash,
  generateRandomString,
  paginate,
  capitalizeWords,
  truncateText,
  getImageDimensions,
  sanitizeHtml,
  parseSearchQuery,
  generateMetaDescription,
  isValidObjectId,
  getFileExtension,
  isImageFile,
  convertToWebP,
  createThumbnail
};
