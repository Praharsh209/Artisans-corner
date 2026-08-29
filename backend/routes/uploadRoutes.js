const express = require('express');
const multer = require('multer');
const router = express.Router();
const { uploadProductImage } = require('../controllers/uploadController');
const { protect, isVendor } = require('../middleware/authMiddleware');

// Multer memory storage (5MB max)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)) {
      return cb(new Error('Only image files (JPG, PNG, WebP) are allowed'));
    }
    cb(null, true);
  },
});

// Middleware wrapper to return clean JSON errors on multer validation failures
const multerUpload = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'Image size exceeds 10MB limit' });
      }
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

router.post('/', protect, isVendor, multerUpload, uploadProductImage);

module.exports = router;
