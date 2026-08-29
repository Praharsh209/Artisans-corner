import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  DollarSign,
  Package,
  Check,
  AlertCircle,
} from 'lucide-react';

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [successNotice, setSuccessNotice] = useState('');

  const fetchVendorOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders/vendor/my-orders');
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching vendor orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorOrders();
  }, []);

  const handleStatusChange = async (orderId, itemId, newStatus) => {
    try {
      setUpdatingItemId(itemId);
      await api.put(`/orders/${orderId}/items/${itemId}/status`, {
        status: newStatus,
      });

      // Update local state smoothly
      setOrders((prev) =>
        prev.map((order) => {
          if (order._id === orderId) {
            return {
              ...order,
              items: order.items.map((item) =>
                item._id === itemId ? { ...item, itemStatus: newStatus } : item
              ),
            };
          }
          return order;
        })
      );

      setSuccessNotice(`Item fulfillment status updated to "${newStatus}"!`);
      setTimeout(() => setSuccessNotice(''), 2500);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingItemId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading incoming customer orders and packing queues..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-parchment-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            Order Fulfillment & Shipping Console
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Track customer shipments, mark items as Shipped / Delivered, and review creator payouts
          </p>
        </div>
      </div>

      {successNotice && (
        <div className="bg-moss-50 border border-moss-200 text-moss-800 text-xs p-4 rounded-2xl flex items-center space-x-2">
          <Check size={16} className="text-moss-700" />
          <span>{successNotice}</span>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-parchment-200 p-12 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-parchment-100 text-moss-700 flex items-center justify-center mx-auto text-2xl">
            📦
          </div>
          <h3 className="font-serif font-bold text-xl text-stone-900">No Orders in Your Queue</h3>
          <p className="text-xs text-stone-500">
            As soon as shoppers purchase your handmade creations, their orders and delivery addresses will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl border border-parchment-200 p-6 sm:p-8 shadow-sm space-y-6"
            >
              {/* Order Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-parchment-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-serif font-bold text-base text-stone-900">
                      Order #{order._id.substring(order._id.length - 8).toUpperCase()}
                    </span>
                    <span className="text-xs bg-moss-50 text-moss-800 border border-moss-200 px-2 py-0.5 rounded font-semibold">
                      Paid via Stripe
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Ordered on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <span className="text-xs text-stone-400 block">Your Net Earnings (95%)</span>
                    <span className="font-serif font-bold text-lg text-moss-900">
                      ₹{Number(order.vendorEarnings).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid: Order Items with Status Dropdown + Shipping Address */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Items & Status Changer */}
                <div className="lg:col-span-7 space-y-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Your Pieces in this Order:
                  </p>

                  {order.items?.map((item) => (
                    <div
                      key={item._id}
                      className="p-4 rounded-2xl bg-parchment-50/70 border border-parchment-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt=""
                          className="w-14 h-14 rounded-xl object-cover bg-white border border-parchment-200 shrink-0"
                        />
                        <div className="space-y-0.5">
                          <p className="font-serif font-bold text-stone-900 text-xs">{item.name}</p>
                          <p className="text-[11px] text-stone-500">
                            Quantity: {item.quantity} • Payout: ₹{item.vendorPayout || item.price * item.quantity}
                          </p>
                        </div>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] text-stone-500 font-medium">Status:</span>
                        <select
                          value={item.itemStatus || 'Pending'}
                          onChange={(e) =>
                            handleStatusChange(order._id, item._id, e.target.value)
                          }
                          disabled={updatingItemId === item._id}
                          className="bg-white border border-parchment-300 rounded-xl text-xs font-bold text-stone-800 py-1.5 px-3 focus:outline-none focus:border-moss-600 shadow-xs"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing (Crafting)</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Buyer Shipping Destination */}
                <div className="lg:col-span-5 bg-parchment-50/60 rounded-2xl border border-parchment-200 p-5 space-y-3">
                  <div className="flex items-center space-x-2 text-moss-800">
                    <MapPin size={16} />
                    <h4 className="font-serif font-bold text-sm text-stone-900">
                      Buyer Shipping Information
                    </h4>
                  </div>

                  <div className="text-xs text-stone-700 space-y-1 pl-6">
                    <p className="font-bold text-stone-900">{order.buyer?.name}</p>
                    <p className="text-stone-500">{order.buyer?.email}</p>
                    <p className="pt-1">{order.shippingAddress?.street}</p>
                    <p>
                      {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
                      {order.shippingAddress?.postalCode}
                    </p>
                    <p>{order.shippingAddress?.country}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorOrders;
