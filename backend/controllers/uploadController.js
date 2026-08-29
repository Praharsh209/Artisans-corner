const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with environment variables
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// @desc    Upload product image to Cloudinary (with development fallback)
// @route   POST /api/upload
// @access  Private/Vendor
const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded. Please select an image.' });
    }

    const hasCloudinaryKeys =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET &&
      !process.env.CLOUDINARY_CLOUD_NAME.includes('your_') &&
      !process.env.CLOUDINARY_API_KEY.includes('your_');

    if (hasCloudinaryKeys) {
      try {
        // Convert buffer to base64 data URI for Cloudinary stream upload
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'artisans-corner/products',
          transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
        });

        return res.status(200).json({
          url: result.secure_url,
          public_id: result.public_id,
          message: 'Image uploaded successfully to Cloudinary',
        });
      } catch (cloudErr) {
        console.warn('Cloudinary upload warning:', cloudErr.message);
        // Fallback to local Data URI if Cloudinary credentials or network failed
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const localDataUri = `data:${req.file.mimetype};base64,${b64}`;
        return res.status(200).json({
          url: localDataUri,
          message: 'Image processed (Development fallback used due to Cloudinary notice: ' + cloudErr.message + ')',
        });
      }
    }

    // Development fallback when Cloudinary is not configured in .env
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const localDataUri = `data:${req.file.mimetype};base64,${b64}`;

    return res.status(200).json({
      url: localDataUri,
      message: 'Image uploaded successfully (Development fallback). Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend/.env for production Cloudinary storage.',
    });
  } catch (error) {
    console.error('Upload Controller Error:', error);
    res.status(500).json({ message: error.message || 'Image upload failed' });
  }
};

module.exports = {
  uploadProductImage,
};
