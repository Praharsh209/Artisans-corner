import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart, clearCart } from '../store/slices/cartSlice';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice } = useSelector(
    (state) => state.cart
  );
  const { userInfo } = useSelector((state) => state.auth);

  const handleCheckout = () => {
    if (!userInfo) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-parchment-100 text-moss-700 flex items-center justify-center mx-auto text-3xl shadow-xs">
          🧺
        </div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Your Basket is Empty</h1>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          Explore our community of potters, weavers, jewelers, and woodworkers to find something truly unique.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 bg-moss-700 hover:bg-moss-800 text-white font-bold text-xs px-7 py-3.5 rounded-full shadow-warm transition-all"
        >
          <span>Discover Handcrafted Goods</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between border-b border-parchment-200 pb-6 mb-8">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Shopping Basket
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {cartItems.reduce((a, c) => a + (c.quantity || 1), 0)} items in your basket
          </p>
        </div>
        <button
          type="button"
          onClick={() => dispatch(clearCart())}
          className="text-xs text-stone-500 hover:text-red-600 font-semibold underline transition-colors"
        >
          Clear Basket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-parchment-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              {/* Product Thumbnail & Details */}
              <div className="flex items-center space-x-4">
                <Link
                  to={`/product/${item._id}`}
                  className="w-20 h-20 rounded-xl overflow-hidden bg-parchment-100 shrink-0 border border-parchment-200"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div className="space-y-1">
                  <Link
                    to={`/product/${item._id}`}
                    className="font-serif font-bold text-stone-900 hover:text-moss-800 text-sm sm:text-base line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs font-semibold text-moss-800">
                    ₹{Number(item.price).toFixed(2)} each
                  </p>
                  {item.stock <= 5 && (
                    <p className="text-[10px] text-terracotta-600 font-bold">
                      Only {item.stock} left in stock
                    </p>
                  )}
                </div>
              </div>

              {/* Quantity Stepper & Price Subtotal */}
              <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-parchment-100">
                {/* Stepper */}
                <div className="flex items-center border border-parchment-300 rounded-xl bg-parchment-50 overflow-hidden">
                  <button
                    type="button"
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          id: item._id,
                          quantity: Math.max(1, (item.quantity || 1) - 1),
                        })
                      )
                    }
                    className="p-2 text-stone-600 hover:bg-parchment-200"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-stone-900 select-none">
                    {item.quantity || 1}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          id: item._id,
                          quantity: Math.min(item.stock || 99, (item.quantity || 1) + 1),
                        })
                      )
                    }
                    disabled={item.quantity >= (item.stock || 99)}
                    className="p-2 text-stone-600 hover:bg-parchment-200 disabled:opacity-40"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <span className="font-serif font-bold text-stone-900 text-base">
                    ₹{(Number(item.price) * Number(item.quantity || 1)).toFixed(2)}
                  </span>
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => dispatch(removeFromCart(item._id))}
                  className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {/* Shipping Free Tier Progress */}
          <div className="bg-moss-50 border border-moss-200 rounded-2xl p-4 text-xs text-moss-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Truck size={16} className="text-moss-700 shrink-0" />
              <span>
                {itemsPrice >= 999
                  ? '🎉 You unlocked FREE Direct Artisan Shipping!'
                  : `Add ₹${(999 - itemsPrice).toFixed(2)} more to qualify for Free Shipping!`}
              </span>
            </div>
            <Link
              to="/products"
              className="text-moss-900 font-bold underline shrink-0 hover:text-moss-700 ml-2"
            >
              Add more items
            </Link>
          </div>
        </div>

        {/* Right: Summary Box */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl border border-parchment-200 p-6 sm:p-8 shadow-sm space-y-6 sticky top-28">
            <h3 className="font-serif font-bold text-xl text-stone-900 border-b border-parchment-100 pb-3">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-stone-900">₹{itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Direct Artisan Shipping</span>
                <span className="font-semibold text-stone-900">
                  {shippingPrice === 0 ? (
                    <span className="text-moss-700 font-bold">FREE</span>
                  ) : (
                    `₹${shippingPrice.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST (5%)</span>
                <span className="font-semibold text-stone-900">₹{taxPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-parchment-200 pt-4 flex justify-between items-baseline">
              <span className="font-serif font-bold text-base text-stone-900">Total</span>
              <span className="font-serif font-bold text-2xl text-moss-900">
                ₹{totalPrice.toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="w-full bg-moss-700 hover:bg-moss-800 text-white font-bold text-xs py-4 rounded-full shadow-warm hover:shadow-warm-lg transition-all flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={15} />
            </button>

            <div className="pt-2 text-center text-[11px] text-stone-400 flex items-center justify-center space-x-1.5">
              <ShieldCheck size={14} className="text-moss-600" />
              <span>Encrypted Stripe Checkout • Buyer Protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
