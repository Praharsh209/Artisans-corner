const express = require('express');
const router = express.Router();
const {
  getProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getVendorProducts,
  checkReviewEligibility,
  createProductReview,
} = require('../controllers/productController');
const { protect, isVendor } = require('../middleware/authMiddleware');

router.route('/').get(getProducts).post(protect, isVendor, createProduct);
router.get('/featured', getFeaturedProducts);
router.get('/vendor/my-products', protect, isVendor, getVendorProducts);
router
  .route('/:id')
  .get(getProductById)
  .put(protect, isVendor, updateProduct)
  .delete(protect, isVendor, deleteProduct);

router.get('/:id/review-eligibility', protect, checkReviewEligibility);
router.route('/:id/reviews').post(protect, createProductReview);

module.exports = router;
