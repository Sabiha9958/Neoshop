const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const cloudinary = require('../utils/cloudinary');

// Configure multer for file uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and WebP files are allowed.'), false);
  }
};

const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB max file size
  files: 10 // Maximum 10 files
};

// Create multer instance
const upload = multer({
  storage,
  fileFilter,
  limits
});

// Middleware for single image upload
const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    const singleUpload = upload.single(fieldName);
    
    singleUpload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File too large. Maximum size is 5MB.'
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            success: false,
            message: 'Too many files. Maximum is 10 files.'
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      
      next();
    });
  };
};

// Middleware for multiple image upload
const uploadMultiple = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    const multipleUpload = upload.array(fieldName, maxCount);
    
    multipleUpload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File too large. Maximum size is 5MB per file.'
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            success: false,
            message: `Too many files. Maximum is ${maxCount} files.`
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      
      next();
    });
  };
};

// Image processing middleware
const processImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    // Process the image with sharp
    const processedBuffer = await sharp(req.file.buffer)
      .resize(800, 800, { 
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${processedBuffer.toString('base64')}`,
      {
        folder: 'neoshop/products',
        public_id: `product_${Date.now()}`,
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' }
        ]
      }
    );

    // Add the upload result to request
    req.uploadResult = {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height
    };

    next();
  } catch (error) {
    console.error('Image processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process image'
    });
  }
};

// Process multiple images
const processMultipleImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next();
    }

    const uploadPromises = req.files.map(async (file, index) => {
      // Process image
      const processedBuffer = await sharp(file.buffer)
        .resize(800, 800, { 
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 80 })
        .toBuffer();

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${processedBuffer.toString('base64')}`,
        {
          folder: 'neoshop/products',
          public_id: `product_${Date.now()}_${index}`,
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        }
      );

      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        isPrimary: index === 0
      };
    });

    // Wait for all uploads to complete
    req.uploadResults = await Promise.all(uploadPromises);
    
    next();
  } catch (error) {
    console.error('Multiple images processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process images'
    });
  }
};

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
  }
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  processImage,
  processMultipleImages,
  deleteImage
};
