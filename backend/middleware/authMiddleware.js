const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - must be logged in
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'artisans_secret_key_12345');

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error('JWT Auth Error:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Vendor authorization - must be vendor or both
const isVendor = (req, res, next) => {
  if (req.user && (req.user.role === 'vendor' || req.user.role === 'both')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Vendor account required' });
  }
};

module.exports = { protect, isVendor };
