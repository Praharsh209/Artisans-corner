import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { CheckCircle, Package, ArrowRight, Truck, Heart } from 'lucide-react';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Generating your handcrafted order confirmation..." />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center space-y-8">
      {/* Celebratory Icon */}
      <div className="w-20 h-20 rounded-full bg-moss-100 text-moss-700 flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle size={44} className="stroke-[2.5]" />
      </div>

      <div className="space-y-2">
        <span className="text-xs uppercase font-bold tracking-widest text-terracotta-600">
          Payment Confirmed via Stripe
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Thank you for supporting independent makers!
        </h1>
        <p className="text-sm text-stone-600 max-w-lg mx-auto">
          Your order <span className="font-mono font-bold text-stone-900">#{order?._id || id}</span> has been dispatched to the artisan studios for handcrafted preparation.
        </p>
      </div>

      {order && (
        <div className="bg-white rounded-3xl border border-parchment-200 p-6 sm:p-8 text-left shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-parchment-100 pb-4">
            <div>
              <p className="text-xs text-stone-400 font-semibold uppercase">Order Date</p>
              <p className="text-sm font-bold text-stone-900">
                {new Date(order.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-stone-400 font-semibold uppercase">Total Paid</p>
              <p className="font-serif text-xl font-bold text-moss-800">
                ₹{Number(order.totalPrice).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Items preview */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Purchased Handcrafted Works
            </p>
            {order.orderItems?.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between py-2 border-b border-parchment-50 last:border-0 text-xs"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover bg-parchment-100 border border-parchment-200"
                  />
                  <div>
                    <p className="font-bold text-stone-900">{item.name}</p>
                    <p className="text-stone-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-serif font-bold text-stone-900">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Shipping destination */}
          <div className="pt-2 border-t border-parchment-100 text-xs text-stone-600">
            <p className="font-bold text-stone-900 mb-1">Delivering to:</p>
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
              {order.shippingAddress.postalCode}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
        <Link
          to={`/orders/${id}`}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-moss-700 hover:bg-moss-800 text-white font-bold text-xs px-7 py-3.5 rounded-full shadow-warm transition-all"
        >
          <Package size={15} />
          <span>Track Order Fulfillment</span>
        </Link>
        <Link
          to="/products"
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-parchment-100 border border-parchment-300 text-stone-800 font-bold text-xs px-7 py-3.5 rounded-full transition-all"
        >
          <span>Continue Shopping</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
