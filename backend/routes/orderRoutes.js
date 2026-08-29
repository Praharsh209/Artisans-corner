const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  createOrder,
  getMyOrders,
  getOrderById,
  getVendorOrders,
  updateOrderItemStatus,
} = require('../controllers/orderController');
const { protect, isVendor } = require('../middleware/authMiddleware');

router.post('/create-payment-intent', protect, createPaymentIntent);

router.route('/').post(protect, createOrder);

router.get('/my-orders', protect, getMyOrders);

router.get('/vendor/my-orders', protect, isVendor, getVendorOrders);

router.get('/:id', protect, getOrderById);

router.put(
  '/:orderId/items/:itemId/status',
  protect,
  isVendor,
  updateOrderItemStatus
);

module.exports = router;
