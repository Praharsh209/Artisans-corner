import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import api from '../api/axios';
import { saveShippingAddress, clearCart } from '../store/slices/cartSlice';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Truck,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

// Stripe public key from environment (or default test key for dev)
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx'
);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#232924',
      fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '14px',
      '::placeholder': {
        color: '#A48967',
      },
    },
    invalid: {
      color: '#B25034',
      iconColor: '#B25034',
    },
  },
};

// Inner Checkout Form Component
const CheckoutForm = ({ shipping, setShipping, onOrderSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice } = useSelector(
    (state) => state.cart
  );
  const { userInfo } = useSelector((state) => state.auth);

  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [isDevMock, setIsDevMock] = useState(false);

  // Initialize payment intent on mount
  useEffect(() => {
    const initPaymentIntent = async () => {
      if (cartItems.length === 0) return;
      try {
        const { data } = await api.post('/orders/create-payment-intent', {
          cartItems,
        });
        setClientSecret(data.clientSecret);
        setIsDevMock(data.isDevMock || false);
      } catch (err) {
        console.warn('Payment intent init warning:', err.response?.data?.message || err.message);
        // Do not block the user form; fall back to simulated test payment
        setIsDevMock(true);
      }
    };

    initPaymentIntent();
  }, [cartItems]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!shipping.street.trim() || !shipping.city.trim() || !shipping.state.trim() || !shipping.postalCode.trim()) {
      setErrorMessage('Please fill in all required shipping address fields.');
      return;
    }

    if (cartItems.length === 0) {
      setErrorMessage('Your cart is empty. Please add items before checking out.');
      return;
    }

    // Save shipping address to Redux & storage
    dispatch(saveShippingAddress(shipping));

    setPaymentProcessing(true);
    setErrorMessage('');

    try {
      let paymentResultId = `txn_${Date.now()}`;

      // 1. Process Stripe Payment Confirmation if live client secret exists
      if (stripe && elements && clientSecret && !isDevMock && !clientSecret.startsWith('mock_')) {
        const cardElement = elements.getElement(CardElement);
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: userInfo?.name || 'Artisan Buyer',
              email: userInfo?.email || 'buyer@artisans.com',
              address: {
                line1: shipping.street,
                city: shipping.city,
                state: shipping.state,
                postal_code: shipping.postalCode,
                country: 'IN',
              },
            },
          },
        });

        if (error) {
          // Payment failed: keep cart intact, show error, stop
          setErrorMessage(error.message || 'Card authorization failed. Please check details.');
          setPaymentProcessing(false);
          return;
        }

        if (paymentIntent && paymentIntent.status === 'succeeded') {
          paymentResultId = paymentIntent.id;
        }
      } else {
        // Dev / Test Mode: brief realistic processing pause
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      // 2. Submit order to backend to save in MongoDB
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity || 1,
        })),
        shippingAddress: shipping,
        paymentResult: {
          id: paymentResultId,
          status: 'succeeded',
          update_time: new Date().toISOString(),
          email_address: userInfo?.email,
        },
      };

      const { data: createdOrder } = await api.post('/orders', orderPayload);

      if (!createdOrder || !createdOrder._id) {
        throw new Error('Order confirmation could not be verified by server. Your cart items have been kept.');
      }

      // Notify parent that order succeeded so it won't redirect to /cart
      if (onOrderSuccess) {
        onOrderSuccess();
      }

      // 3. ONLY after MongoDB confirms the saved order, clear the cart
      dispatch(clearCart());

      // 4. Navigate to Order Success page
      navigate(`/order-success/${createdOrder._id}`, { replace: true });
    } catch (err) {
      console.error('Order creation error:', err);
      // If order creation fails, cart is preserved!
      setErrorMessage(
        err.response?.data?.message || err.message || 'Payment processing failed. Your cart items have been kept.'
      );
    } finally {
      setPaymentProcessing(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-8">
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-2xl flex items-center space-x-2.5 shadow-xs">
          <AlertCircle size={18} className="shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Step 1: Shipping Address */}
      <div className="bg-white rounded-3xl border border-parchment-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 border-b border-parchment-100 pb-3">
          <Truck size={18} className="text-moss-700" />
          <h2 className="font-serif font-bold text-lg text-stone-900">
            1. Shipping Destination
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
              Street Address *
            </label>
            <input
              type="text"
              value={shipping.street}
              onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
              placeholder="e.g. 42 Indiranagar, 12th Main"
              required
              className="w-full bg-parchment-50 border border-parchment-300 rounded-xl p-3 text-xs text-stone-800 focus:outline-none focus:border-moss-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
              City *
            </label>
            <input
              type="text"
              value={shipping.city}
              onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
              placeholder="Bengaluru"
              required
              className="w-full bg-parchment-50 border border-parchment-300 rounded-xl p-3 text-xs text-stone-800 focus:outline-none focus:border-moss-600 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
                State *
              </label>
              <input
                type="text"
                value={shipping.state}
                onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                placeholder="Karnataka"
                required
                className="w-full bg-parchment-50 border border-parchment-300 rounded-xl p-3 text-xs text-stone-800 focus:outline-none focus:border-moss-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
                PIN Code *
              </label>
              <input
                type="text"
                value={shipping.postalCode}
                onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                placeholder="560038"
                required
                className="w-full bg-parchment-50 border border-parchment-300 rounded-xl p-3 text-xs text-stone-800 focus:outline-none focus:border-moss-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
              Country
            </label>
            <input
              type="text"
              value={shipping.country || 'India'}
              readOnly
              className="w-full bg-parchment-100/70 border border-parchment-200 rounded-xl p-3 text-xs text-stone-600 select-none cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Step 2: Stripe Payment Sheet */}
      <div className="bg-white rounded-3xl border border-parchment-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-parchment-100 pb-3">
          <div className="flex items-center space-x-2">
            <CreditCard size={18} className="text-moss-700" />
            <h2 className="font-serif font-bold text-lg text-stone-900">
              2. Payment Information
            </h2>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-moss-700 bg-moss-50 border border-moss-200 px-2.5 py-0.5 rounded-full">
            Stripe Test Mode
          </span>
        </div>

        {/* Card input field */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
            Credit or Debit Card Details
          </label>
          <div className="p-4 bg-parchment-50 border border-parchment-300 rounded-2xl focus-within:border-moss-600 focus-within:bg-white transition-all shadow-inner">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>

          <div className="bg-moss-50/70 border border-moss-200/80 rounded-xl p-3 text-[11px] text-stone-600 space-y-1">
            <p className="font-bold text-moss-900">💡 Test Card Credentials:</p>
            <p>
              Use card number{' '}
              <code className="bg-white px-1.5 py-0.5 rounded border border-moss-200 font-mono text-moss-800 font-bold">
                4242 4242 4242 4242
              </code>{' '}
              with any future MM/YY and any 3 digits CVC.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={paymentProcessing}
          className="w-full mt-4 bg-moss-700 hover:bg-moss-800 disabled:bg-moss-400 text-white font-bold text-sm py-4 rounded-full shadow-warm hover:shadow-warm-lg transition-all flex items-center justify-center space-x-2"
        >
          <Lock size={16} />
          <span>
            {paymentProcessing
              ? 'Authorizing with Stripe & Creating Order...'
              : `Authorize & Pay ₹${totalPrice.toFixed(2)}`}
          </span>
        </button>

        <div className="text-center pt-2 flex items-center justify-center space-x-2 text-[11px] text-stone-400">
          <ShieldCheck size={14} className="text-moss-600" />
          <span>256-bit SSL Encrypted • Direct payout to independent artisans</span>
        </div>
      </div>
    </form>
  );
};

// Top-level Checkout Wrapper
const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice, shippingAddress } =
    useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const orderSuccessRef = useRef(false);

  const [shipping, setShipping] = useState({
    street: shippingAddress?.street || userInfo?.address?.street || '',
    city: shippingAddress?.city || userInfo?.address?.city || '',
    state: shippingAddress?.state || userInfo?.address?.state || '',
    postalCode: shippingAddress?.postalCode || userInfo?.address?.postalCode || '',
    country: shippingAddress?.country || userInfo?.address?.country || 'India',
  });

  // Guard checks on mount only
  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/checkout');
    } else if (cartItems.length === 0 && !orderSuccessRef.current) {
      navigate('/cart');
    }
  }, [userInfo, navigate]);

  const handleOrderSuccess = () => {
    orderSuccessRef.current = true;
  };

  if (!userInfo || (cartItems.length === 0 && !orderSuccessRef.current)) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link
            to="/cart"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-stone-500 hover:text-moss-800 mb-2 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Basket</span>
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Secure Checkout
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Payment Form & Stripe Elements */}
        <div className="lg:col-span-7">
          <Elements stripe={stripePromise}>
            <CheckoutForm
              shipping={shipping}
              setShipping={setShipping}
              onOrderSuccess={handleOrderSuccess}
            />
          </Elements>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-parchment-200 p-6 sm:p-8 shadow-sm space-y-6 sticky top-28">
            <h3 className="font-serif font-bold text-xl text-stone-900 border-b border-parchment-100 pb-3">
              Order Review ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
            </h3>

            {/* Item list preview */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center space-x-3 text-xs">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover bg-parchment-100 border border-parchment-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-stone-900 truncate">{item.name}</p>
                    <p className="text-stone-500">Qty: {item.quantity || 1}</p>
                  </div>
                  <span className="font-serif font-bold text-stone-900">
                    ₹{(Number(item.price) * Number(item.quantity || 1)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="border-t border-parchment-100 pt-4 space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-stone-900">₹{itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-stone-900">
                  {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST (5%)</span>
                <span className="font-semibold text-stone-900">₹{taxPrice.toFixed(2)}</span>
              </div>
              <div className="border-t border-parchment-200 pt-3 flex justify-between items-baseline">
                <span className="font-serif font-bold text-base text-stone-900">Total</span>
                <span className="font-serif font-bold text-2xl text-moss-900">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
