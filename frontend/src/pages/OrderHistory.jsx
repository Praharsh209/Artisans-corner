import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Package, ArrowRight, Clock, CheckCircle2, Truck, Eye } from 'lucide-react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/orders/my-orders');
        setOrders(data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center space-x-1 bg-green-50 text-green-800 border border-green-200 text-xs font-bold px-2.5 py-1 rounded-full">
            <CheckCircle2 size={12} className="text-green-600" />
            <span>Delivered</span>
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center space-x-1 bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold px-2.5 py-1 rounded-full">
            <Truck size={12} className="text-blue-600" />
            <span>Shipped</span>
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center space-x-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold px-2.5 py-1 rounded-full">
            <Clock size={12} className="text-amber-600" />
            <span>In Studio Crafting</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 bg-stone-100 text-stone-700 border border-stone-200 text-xs font-bold px-2.5 py-1 rounded-full">
            <Clock size={12} className="text-stone-500" />
            <span>Pending</span>
          </span>
        );
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving your past artisan acquisitions..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="border-b border-parchment-200 pb-6 mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Order History & Tracking
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Review fulfillment status and tracking for your handcrafted purchases
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-parchment-200 p-12 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-parchment-100 text-moss-700 flex items-center justify-center mx-auto text-2xl">
            📦
          </div>
          <h3 className="font-serif font-bold text-xl text-stone-900">No Orders Placed Yet</h3>
          <p className="text-xs text-stone-600">
            You haven't placed any handcrafted orders yet. Explore our independent creators to get started!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center space-x-1.5 bg-moss-700 text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-moss-800 transition-colors shadow-sm"
          >
            <span>Explore Artisan Shop</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl border border-parchment-200 p-6 sm:p-8 shadow-xs hover:shadow-warm transition-all space-y-6"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-parchment-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-serif font-bold text-stone-900 text-base">
                      Order #{order._id.substring(order._id.length - 8).toUpperCase()}
                    </span>
                    {getStatusBadge(
                      order.isDelivered
                        ? 'Delivered'
                        : order.orderItems?.[0]?.itemStatus || 'Pending'
                    )}
                  </div>
                  <p className="text-xs text-stone-500">
                    Placed on{' '}
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="text-xs text-stone-400 block font-medium">Order Total</span>
                    <span className="font-serif font-bold text-lg text-moss-900">
                      ₹{Number(order.totalPrice).toFixed(2)}
                    </span>
                  </div>

                  <Link
                    to={`/orders/${order._id}`}
                    className="inline-flex items-center space-x-1.5 bg-parchment-100 hover:bg-moss-700 hover:text-white text-stone-800 text-xs font-bold px-4 py-2.5 rounded-xl border border-parchment-300 transition-all"
                  >
                    <Eye size={14} />
                    <span>View Details</span>
                  </Link>
                </div>
              </div>

              {/* Items Line Strip */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {order.orderItems?.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center space-x-3 bg-parchment-50/70 p-3 rounded-2xl border border-parchment-100"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover bg-white border border-parchment-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-stone-900 text-xs truncate">{item.name}</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Qty: {item.quantity} • ₹{item.price}
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-stone-600 bg-white px-2 py-0.5 rounded border border-parchment-200">
                        Status: {item.itemStatus || 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
