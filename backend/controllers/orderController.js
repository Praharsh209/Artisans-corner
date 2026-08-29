const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_artisan_key');
const Order = require('../models/Order');
const Product = require('../models/Product');

// Helper to calculate pricing based on database products
const calculateOrderPrices = async (cartItems) => {
  let itemsPrice = 0;
  const verifiedItems = [];

  for (const item of cartItems) {
    const productId = item.product || item._id;
    const dbProduct = await Product.findById(productId);

    if (!dbProduct) {
      throw new Error(`Product not found in database: ${item.name || productId}`);
    }

    const qty = Number(item.quantity) > 0 ? Number(item.quantity) : 1;

    if (dbProduct.stock < qty) {
      throw new Error(`Insufficient stock for "${dbProduct.name}". Available: ${dbProduct.stock}`);
    }

    const itemTotal = Number(dbProduct.price) * qty;
    itemsPrice += itemTotal;

    const platformFee = Math.round(itemTotal * 0.05 * 100) / 100; // 5% marketplace fee
    const vendorPayout = Math.round(itemTotal * 0.95 * 100) / 100; // 95% to artisan

    verifiedItems.push({
      product: dbProduct._id,
      name: dbProduct.name,
      image: dbProduct.images && dbProduct.images.length > 0 ? dbProduct.images[0] : '',
      price: dbProduct.price,
      quantity: qty,
      vendor: dbProduct.vendor,
      itemStatus: 'Pending',
      platformFee,
      vendorPayout,
    });
  }

  // Shipping calculation: Free over ₹999, otherwise ₹99 flat rate
  const shippingPrice = itemsPrice > 999 ? 0 : 99;
  // Estimated GST: 5%
  const taxPrice = Math.round(itemsPrice * 0.05 * 100) / 100;
  const totalPrice = Math.round((itemsPrice + shippingPrice + taxPrice) * 100) / 100;

  return {
    itemsPrice: Math.round(itemsPrice * 100) / 100,
    shippingPrice,
    taxPrice,
    totalPrice,
    verifiedItems,
  };
};

// @desc    Create Stripe Payment Intent (recalculating prices strictly from DB)
// @route   POST /api/orders/create-payment-intent
// @access  Private
const createPaymentIntent = async (req, res) => {
  try {
    const { cartItems } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    const { totalPrice, itemsPrice, shippingPrice, taxPrice } = await calculateOrderPrices(cartItems);

    // Stripe amount in smallest currency unit (paise for INR)
    const amountInPaise = Math.round(totalPrice * 100);

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const hasValidStripeKey =
      stripeKey &&
      stripeKey.startsWith('sk_') &&
      !stripeKey.includes('mock') &&
      !stripeKey.includes('replace_') &&
      !stripeKey.includes('your_');

    if (hasValidStripeKey) {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amountInPaise,
          currency: 'inr',
          metadata: {
            buyerId: req.user._id.toString(),
            buyerEmail: req.user.email,
          },
          automatic_payment_methods: {
            enabled: true,
          },
        });

        return res.json({
          clientSecret: paymentIntent.client_secret,
          totalPrice,
          itemsPrice,
          shippingPrice,
          taxPrice,
          isDevMock: false,
        });
      } catch (stripeErr) {
        console.warn('Stripe Live Test Intent Warning:', stripeErr.message);
        // Fall back to dev mock secret so offline/mock testing continues smoothly
        return res.json({
          clientSecret: `mock_secret_dev_${Date.now()}`,
          isDevMock: true,
          totalPrice,
          itemsPrice,
          shippingPrice,
          taxPrice,
          message: 'Stripe test fallback used: ' + stripeErr.message,
        });
      }
    }

    // Friendly Dev Mode Fallback when Stripe keys are not yet configured
    res.json({
      clientSecret: `mock_secret_dev_${Date.now()}`,
      isDevMock: true,
      totalPrice,
      itemsPrice,
      shippingPrice,
      taxPrice,
      message: 'Running in Test/Dev payment mode. Add a valid STRIPE_SECRET_KEY in backend/.env for live Stripe processing.',
    });
  } catch (error) {
    console.error('Create Payment Intent Error:', error.message);
    res.status(400).json({ message: error.message || 'Failed to initialize payment' });
  }
};

// @desc    Create new order after successful payment confirmation
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentResult } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items found in request' });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({ message: 'Valid shipping address is required' });
    }

    // Verify prices and stock from MongoDB database directly
    const { itemsPrice, shippingPrice, taxPrice, totalPrice, verifiedItems } =
      await calculateOrderPrices(orderItems);

    // Decrement stock for each product atomically
    for (const item of verifiedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    const order = new Order({
      buyer: req.user._id,
      orderItems: verifiedItems,
      shippingAddress,
      paymentMethod: 'Stripe',
      paymentResult: paymentResult || {
        id: `txn_${Date.now()}`,
        status: 'succeeded',
        update_time: new Date().toISOString(),
        email_address: req.user.email,
      },
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      isPaid: true,
      paidAt: new Date(),
    });

    const createdOrder = await order.save();
    console.log(`[Order Created] Order #${createdOrder._id} successfully saved for buyer ${req.user.email}`);
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Create Order Error:', error.message);
    res.status(400).json({ message: error.message || 'Failed to create order in database' });
  }
};

// @desc    Get logged in buyer's orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .sort({ createdAt: -1 })
      .populate('orderItems.vendor', 'name shopProfile');

    res.json(orders);
  } catch (error) {
    console.error('Get My Orders Error:', error.message);
    res.status(500).json({ message: error.message || 'Failed to fetch order history' });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name email')
      .populate('orderItems.vendor', 'name email shopProfile');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Access control: only the buyer or an involved vendor can view
    const isBuyer = order.buyer._id.toString() === req.user._id.toString();
    const isVendorInOrder = order.orderItems.some(
      (item) => item.vendor && item.vendor._id.toString() === req.user._id.toString()
    );

    if (!isBuyer && !isVendorInOrder) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get Order By ID Error:', error.message);
    res.status(500).json({ message: error.message || 'Failed to fetch order details' });
  }
};

// @desc    Get vendor's incoming orders containing their products
// @route   GET /api/orders/vendor/my-orders
// @access  Private/Vendor
const getVendorOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      'orderItems.vendor': req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate('buyer', 'name email');

    // Filter items to only show the ones belonging to this vendor
    const vendorSpecificOrders = orders.map((order) => {
      const vendorItems = order.orderItems.filter(
        (item) => item.vendor && item.vendor.toString() === req.user._id.toString()
      );
      const vendorEarnings = vendorItems.reduce(
        (sum, item) => sum + (item.vendorPayout || item.price * item.quantity),
        0
      );

      return {
        _id: order._id,
        buyer: order.buyer,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        isPaid: order.isPaid,
        paidAt: order.paidAt,
        createdAt: order.createdAt,
        items: vendorItems,
        vendorEarnings: Math.round(vendorEarnings * 100) / 100,
      };
    });

    res.json(vendorSpecificOrders);
  } catch (error) {
    console.error('Get Vendor Orders Error:', error.message);
    res.status(500).json({ message: error.message || 'Failed to fetch vendor orders' });
  }
};

// @desc    Update single item fulfillment status within an order
// @route   PUT /api/orders/:orderId/items/:itemId/status
// @access  Private/Vendor
const updateOrderItemStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order item status' });
    }

    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const item = order.orderItems.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Order item not found' });
    }

    // Security: ensure vendor owns this item
    if (item.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    item.itemStatus = status;

    // If all items are delivered, mark entire order as delivered
    const allDelivered = order.orderItems.every((i) => i.itemStatus === 'Delivered');
    if (allDelivered) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    await order.save();
    res.json({ message: 'Item status updated successfully', item });
  } catch (error) {
    console.error('Update Order Item Status Error:', error.message);
    res.status(500).json({ message: error.message || 'Failed to update item status' });
  }
};

module.exports = {
  createPaymentIntent,
  createOrder,
  getMyOrders,
  getOrderById,
  getVendorOrders,
  updateOrderItemStatus,
};
