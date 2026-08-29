const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/Product');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'artisans_secret_key_12345', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, shopName, shopDescription } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const userRole = role === 'vendor' || role === 'both' ? role : 'buyer';
    const shopProfile =
      userRole !== 'buyer'
        ? {
            shopName: shopName || `${name}'s Workshop`,
            description: shopDescription || 'Handcrafted goods made with passion and tradition.',
            logo: '',
            banner: '',
          }
        : {};

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
      shopProfile,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        shopProfile: user.shopProfile,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        shopProfile: user.shopProfile,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        shopProfile: user.shopProfile,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.address) {
        user.address = {
          street: req.body.address.street || user.address.street,
          city: req.body.address.city || user.address.city,
          state: req.body.address.state || user.address.state,
          postalCode: req.body.address.postalCode || user.address.postalCode,
          country: req.body.address.country || user.address.country,
        };
      }

      if (req.body.shopProfile && (user.role === 'vendor' || user.role === 'both')) {
        user.shopProfile = {
          shopName: req.body.shopProfile.shopName || user.shopProfile.shopName,
          logo: req.body.shopProfile.logo || user.shopProfile.logo,
          description: req.body.shopProfile.description || user.shopProfile.description,
          banner: req.body.shopProfile.banner || user.shopProfile.banner,
        };
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        address: updatedUser.address,
        shopProfile: updatedUser.shopProfile,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Become a vendor / Upgrade account
// @route   POST /api/auth/become-vendor
// @access  Private
const becomeVendor = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { shopName, description, logo, banner } = req.body;

    user.role = user.role === 'buyer' ? 'vendor' : 'both';
    user.shopProfile = {
      shopName: shopName || `${user.name}'s Workshop`,
      description: description || 'Handcrafted with passion.',
      logo: logo || user.shopProfile?.logo || '',
      banner: banner || user.shopProfile?.banner || '',
    };

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      address: updatedUser.address,
      shopProfile: updatedUser.shopProfile,
      token: generateToken(updatedUser._id),
      message: 'Congratulations! You are now an Artisan seller.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get public vendor shop profile & items
// @route   GET /api/auth/vendor/:id
// @access  Public
const getVendorPublicProfile = async (req, res) => {
  try {
    const vendor = await User.findById(req.params.id).select('-password');

    if (!vendor || (vendor.role !== 'vendor' && vendor.role !== 'both')) {
      return res.status(404).json({ message: 'Artisan shop not found' });
    }

    const products = await Product.find({ vendor: vendor._id });

    res.json({
      vendor: {
        _id: vendor._id,
        name: vendor.name,
        shopProfile: vendor.shopProfile,
        createdAt: vendor.createdAt,
      },
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  becomeVendor,
  getVendorPublicProfile,
};
