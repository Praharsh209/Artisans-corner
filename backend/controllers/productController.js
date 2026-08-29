const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Fetch all products with search, category filtering & pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 12;
    const page = Number(req.query.pageNumber) || 1;

    const query = {};

    // 1. Keyword search (Name, description, or tags)
    if (req.query.keyword && req.query.keyword.trim() !== '') {
      const keywordRegex = { $regex: req.query.keyword.trim(), $options: 'i' };
      query.$or = [
        { name: keywordRegex },
        { description: keywordRegex },
        { tags: keywordRegex },
      ];
    }

    // 2. Category filter
    if (req.query.category && req.query.category !== 'all') {
      query.category = req.query.category;
    }

    // 3. Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // 4. In-stock only filter
    if (req.query.inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // 5. Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (req.query.sort === 'price-low') {
      sortOption = { price: 1 };
    } else if (req.query.sort === 'price-high') {
      sortOption = { price: -1 };
    } else if (req.query.sort === 'rating') {
      sortOption = { averageRating: -1 };
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('vendor', 'name email shopProfile')
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      totalProducts: count,
    });
  } catch (error) {
    console.error('Get Products Error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch products' });
  }
};

// @desc    Fetch top featured products for homepage
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate('vendor', 'name shopProfile')
      .sort({ averageRating: -1, createdAt: -1 })
      .limit(8);

    res.json(products);
  } catch (error) {
    console.error('Get Featured Products Error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch featured products' });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'vendor',
      'name email shopProfile'
    );

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Get Product By ID Error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch product details' });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Vendor
const createProduct = async (req, res) => {
  try {
    const { name, description, category, images, price, stock, tags } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Product title is required' });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({ message: 'Product description is required' });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({ message: 'Product category is required' });
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0) {
      return res.status(400).json({ message: 'Please provide a valid product price' });
    }

    const numStock = Number(stock);
    if (isNaN(numStock) || numStock < 0) {
      return res.status(400).json({ message: 'Please provide a valid stock count' });
    }

    let parsedImages = [];
    if (Array.isArray(images) && images.length > 0) {
      parsedImages = images.filter((img) => typeof img === 'string' && img.trim().length > 0);
    } else if (typeof images === 'string' && images.trim().length > 0) {
      parsedImages = [images.trim()];
    }

    if (parsedImages.length === 0) {
      return res.status(400).json({ message: 'Please provide at least one product photo' });
    }

    let parsedTags = [];
    if (Array.isArray(tags)) {
      parsedTags = tags.map((t) => String(t).trim()).filter(Boolean);
    } else if (typeof tags === 'string') {
      parsedTags = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const product = new Product({
      vendor: req.user._id,
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      images: parsedImages,
      price: numPrice,
      stock: numStock,
      tags: parsedTags,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({ message: error.message || 'Failed to create product' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Vendor
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Security: ensure vendor owns this product
    if (product.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this product' });
    }

    const { name, description, category, images, price, stock, tags } = req.body;

    if (name !== undefined) product.name = name.trim();
    if (description !== undefined) product.description = description.trim();
    if (category !== undefined) product.category = category.trim();

    if (images !== undefined) {
      let parsedImages = [];
      if (Array.isArray(images)) {
        parsedImages = images.filter((img) => typeof img === 'string' && img.trim().length > 0);
      } else if (typeof images === 'string' && images.trim().length > 0) {
        parsedImages = [images.trim()];
      }
      if (parsedImages.length > 0) {
        product.images = parsedImages;
      }
    }

    if (price !== undefined && !isNaN(Number(price))) {
      product.price = Number(price);
    }

    if (stock !== undefined && !isNaN(Number(stock))) {
      product.stock = Number(stock);
    }

    if (tags !== undefined) {
      product.tags = Array.isArray(tags)
        ? tags.map((t) => String(t).trim()).filter(Boolean)
        : tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(500).json({ message: error.message || 'Failed to update product' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Vendor
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Security: ensure vendor owns this product
    if (product.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({ message: error.message || 'Failed to delete product' });
  }
};

// @desc    Get logged in vendor's products
// @route   GET /api/products/vendor/my-products
// @access  Private/Vendor
const getVendorProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Get Vendor Products Error:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch vendor products' });
  }
};

// @desc    Check if logged in user is eligible to review this product (purchased & not yet reviewed)
// @route   GET /api/products/:id/review-eligibility
// @access  Private
const checkReviewEligibility = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const alreadyReviewed = product.reviews.some(
      (r) => r.user.toString() === req.user._id.toString()
    );

    const hasPurchased = await Order.findOne({
      buyer: req.user._id,
      isPaid: true,
      'orderItems.product': product._id,
    });

    res.json({
      hasPurchased: Boolean(hasPurchased),
      alreadyReviewed,
      canReview: Boolean(hasPurchased) && !alreadyReviewed,
    });
  } catch (error) {
    console.error('Eligibility Check Error:', error);
    res.status(500).json({ message: error.message || 'Failed to check eligibility' });
  }
};

// @desc    Create new verified buyer product review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // 1. Verify Buyer has purchased this product
    const hasPurchased = await Order.findOne({
      buyer: req.user._id,
      isPaid: true,
      'orderItems.product': product._id,
    });

    if (!hasPurchased) {
      return res.status(403).json({
        message: 'Only verified buyers who have purchased this handcrafted creation can submit a review.',
      });
    }

    // 2. Prevent duplicate reviews from the same buyer
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already submitted a review for this piece.' });
    }

    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: 'Please select a rating between 1 and 5 stars.' });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: 'Please provide a written review comment.' });
    }

    const newReview = {
      user: req.user._id,
      name: req.user.name,
      rating: numRating,
      comment: comment.trim(),
      createdAt: new Date(),
    };

    product.reviews.push(newReview);
    product.numReviews = product.reviews.length;
    const totalRatingSum = product.reviews.reduce((acc, item) => item.rating + acc, 0);
    product.averageRating = Math.round((totalRatingSum / product.reviews.length) * 10) / 10;

    await product.save();
    console.log(`[Review Saved] Verified review added to product "${product.name}" by user ${req.user.name} (${numRating} stars)`);

    res.status(201).json({
      message: 'Review submitted successfully',
      reviews: product.reviews,
      averageRating: product.averageRating,
      numReviews: product.numReviews,
    });
  } catch (error) {
    console.error('Create Review Error:', error);
    res.status(500).json({ message: error.message || 'Failed to submit review' });
  }
};

module.exports = {
  getProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getVendorProducts,
  checkReviewEligibility,
  createProductReview,
};
