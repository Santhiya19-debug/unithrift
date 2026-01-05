const multer = require('multer');
const { storage } = require('../config/cloudinary');

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit per image
    files: 5 // Maximum 5 images per product
  },
  fileFilter: (req, file, cb) => {
    // Double-check file types before they even reach Cloudinary
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (jpg, png, webp) are allowed!'), false);
    }
  }
});

module.exports = upload;