import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Store,
  MapPin,
  CreditCard,
} from 'lucide-react';

const OrderDetails = () => {
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
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Loading full invoice and tracking data..." />;
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Order Not Found</h2>
        <Link
          to="/orders"
          className="mt-4 inline-block bg-moss-700 text-white text-xs font-bold px-6 py-2.5 rounded-full"
        >
          Return to Orders
        </Link>
      </div>
    );
  }

  // Determine highest step in tracking
  const steps = [
    { label: 'Pending', desc: 'Order Placed & Paid' },
    { label: 'Processing', desc: 'Crafting in Studio' },
    { label: 'Shipped', desc: 'Dispatched & In Transit' },
    { label: 'Delivered', desc: 'Delivered to Doorstep' },
  ];

  const overallStatus = order.isDelivered
    ? 'Delivered'
    : order.orderItems?.[0]?.itemStatus || 'Pending';

  const currentStepIndex = steps.findIndex((s) => s.label === overallStatus);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div>
        <Link
          to="/orders"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-500 hover:text-moss-800 mb-2 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Order History</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Order #{order._id}
          </h1>
          <span className="text-xs text-stone-500">
            Placed on{' '}
            {new Date(order.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Visual Tracking Progress Bar */}
      <div className="bg-white rounded-3xl border border-parchment-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="font-serif font-bold text-lg text-stone-900">Fulfillment Progression</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step.label}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  isCurrent
                    ? 'border-moss-700 bg-moss-50/80 shadow-xs'
                    : isCompleted
                    ? 'border-moss-300 bg-moss-50/30'
                    : 'border-parchment-200 bg-parchment-50/40 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCompleted ? 'bg-moss-700 text-white' : 'bg-parchment-300 text-stone-700'
                    }`}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <span className="font-bold text-xs text-stone-900">{step.label}</span>
                </div>
                <p className="text-[11px] text-stone-500">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Order Items & Delivery / Payment Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Line Items List */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-parchment-200 p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-lg text-stone-900 border-b border-parchment-100 pb-3">
            Purchased Handcrafted Works ({order.orderItems?.length} items)
          </h3>

          <div className="space-y-4">
            {order.orderItems?.map((item) => (
              <div
                key={item._id}
                className="flex items-start justify-between py-3 border-b border-parchment-100 last:border-0"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover bg-parchment-100 border border-parchment-200 shrink-0"
                  />
                  <div className="space-y-1">
                    <p className="font-serif font-bold text-stone-900 text-sm">{item.name}</p>
                    <p className="text-xs text-stone-500">
                      ₹{Number(item.price).toFixed(2)} × {item.quantity}
                    </p>
                    {item.vendor && (
                      <div className="flex items-center space-x-1 text-[11px] text-terracotta-600 font-medium">
                        <Store size={12} />
                        <span>
                          Artisan: {item.vendor?.shopProfile?.shopName || item.vendor?.name}
                        </span>
                      </div>
                    )}
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-parchment-100 text-stone-700 px-2 py-0.5 rounded">
                      Item Status: {item.itemStatus || 'Pending'}
                    </span>
                  </div>
                </div>

                <span className="font-serif font-bold text-stone-900 text-base">
                  ₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Shipping Address & Invoice Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          {/* Shipping destination card */}
          <div className="bg-white rounded-3xl border border-parchment-200 p-6 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-moss-800">
              <MapPin size={18} />
              <h4 className="font-serif font-bold text-base text-stone-900">Delivery Destination</h4>
            </div>
            <div className="text-xs text-stone-600 leading-relaxed pl-6">
              <p className="font-bold text-stone-900">{order.buyer?.name}</p>
              <p>{order.shippingAddress?.street}</p>
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
                {order.shippingAddress?.postalCode}
              </p>
              <p>{order.shippingAddress?.country}</p>
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="bg-white rounded-3xl border border-parchment-200 p-6 shadow-sm space-y-4">
            <h4 className="font-serif font-bold text-base text-stone-900 border-b border-parchment-100 pb-2">
              Payment Breakdown
            </h4>

            <div className="space-y-2.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-stone-900">
                  ₹{Number(order.itemsPrice).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Artisan Shipping</span>
                <span className="font-semibold text-stone-900">
                  {order.shippingPrice === 0 ? 'FREE' : `₹${Number(order.shippingPrice).toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span className="font-semibold text-stone-900">
                  ₹{Number(order.taxPrice).toFixed(2)}
                </span>
              </div>
              <div className="border-t border-parchment-200 pt-3 flex justify-between items-baseline">
                <span className="font-serif font-bold text-base text-stone-900">Total Charged</span>
                <span className="font-serif font-bold text-xl text-moss-900">
                  ₹{Number(order.totalPrice).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-parchment-100 flex items-center justify-between text-xs text-stone-500">
              <span className="flex items-center space-x-1">
                <CreditCard size={14} className="text-moss-700" />
                <span>Paid via {order.paymentMethod || 'Stripe'}</span>
              </span>
              <span className="font-mono text-[10px] bg-parchment-100 px-2 py-0.5 rounded">
                Status: {order.paymentResult?.status || 'Paid'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
