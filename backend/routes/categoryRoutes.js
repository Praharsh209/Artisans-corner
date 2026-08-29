const express = require('express');
const router = express.Router();
const { getCategories, createCategory } = require('../controllers/categoryController');
const { protect, isVendor } = require('../middleware/authMiddleware');

router.route('/').get(getCategories).post(protect, isVendor, createCategory);

module.exports = router;
