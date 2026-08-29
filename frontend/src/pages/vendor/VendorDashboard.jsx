import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Package,
  ShoppingBag,
  IndianRupee,
  Clock,
  PlusCircle,
  Store,
  ArrowRight,
  TrendingUp,
  Truck,
} from 'lucide-react';

const VendorDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [prodRes, ordRes] = await Promise.all([
          api.get('/products/vendor/my-products'),
          api.get('/orders/vendor/my-orders'),
        ]);
        setProducts(prodRes.data || []);
        setOrders(ordRes.data || []);
      } catch (err) {
        console.error('Error loading vendor dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Calculating your studio metrics & order queues..." />;
  }

  // Calculate stats
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalEarnings = orders.reduce((acc, o) => acc + (o.vendorEarnings || 0), 0);
  const pendingOrders = orders.filter((o) =>
    o.items?.some((i) => i.itemStatus === 'Pending' || i.itemStatus === 'Processing')
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Studio Header */}
      <div className="bg-white rounded-3xl border border-parchment-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-moss-100 border border-moss-200 text-moss-800 flex items-center justify-center font-serif text-2xl font-bold">
            {userInfo.shopProfile?.logo ? (
              <img
                src={userInfo.shopProfile.logo}
                alt=""
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              '🏺'
            )}
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-terracotta-600">
              Artisan Studio Portal
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              {userInfo.shopProfile?.shopName || `${userInfo.name}'s Studio`}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Maker: {userInfo.name} • {userInfo.email}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/vendor/products/new"
            className="inline-flex items-center space-x-1.5 bg-moss-700 hover:bg-moss-800 text-white text-xs font-bold px-5 py-3 rounded-full shadow-warm transition-all"
          >
            <PlusCircle size={15} />
            <span>Add New Product</span>
          </Link>
          <Link
            to="/vendor/orders"
            className="inline-flex items-center space-x-1.5 bg-parchment-100 hover:bg-parchment-200 text-stone-800 text-xs font-bold px-5 py-3 rounded-full border border-parchment-300 transition-all"
          >
            <Truck size={15} />
            <span>Fulfill Orders ({pendingOrders})</span>
          </Link>
          <Link
            to="/vendor/shop-profile"
            className="inline-flex items-center space-x-1.5 bg-white hover:bg-parchment-50 text-stone-800 text-xs font-semibold px-4 py-3 rounded-full border border-parchment-300 transition-all"
          >
            <Store size={15} />
            <span>Shop Profile</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div className="bg-white rounded-3xl border border-parchment-200 p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-moss-700">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Net Earnings (95%)
            </span>
            <div className="w-8 h-8 rounded-xl bg-moss-50 flex items-center justify-center">
              <IndianRupee size={18} />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-stone-900">
            ₹{totalEarnings.toFixed(2)}
          </p>
          <p className="text-[11px] text-stone-500">Direct creator payouts</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-3xl border border-parchment-200 p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-terracotta-600">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Active Creations
            </span>
            <div className="w-8 h-8 rounded-xl bg-terracotta-50 flex items-center justify-center">
              <Package size={18} />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-stone-900">{totalProducts}</p>
          <p className="text-[11px] text-stone-500">Items listed in store</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-3xl border border-parchment-200 p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-700">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Total Studio Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-parchment-100 flex items-center justify-center">
              <ShoppingBag size={18} />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-stone-900">{totalOrders}</p>
          <p className="text-[11px] text-stone-500">Customer purchases</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-3xl border border-parchment-200 p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Pending Fulfillment
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
              <Clock size={18} />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-stone-900">{pendingOrders}</p>
          <p className="text-[11px] text-stone-500">Awaiting shipment / packing</p>
        </div>
      </div>

      {/* Recent Orders & Inventory Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Recent Orders Table */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-parchment-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-parchment-100 pb-4">
            <h3 className="font-serif font-bold text-xl text-stone-900">Recent Customer Orders</h3>
            <Link
              to="/vendor/orders"
              className="text-xs font-bold text-moss-700 hover:text-moss-900 underline"
            >
              View All Orders
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-10 bg-parchment-50 rounded-2xl p-6">
              <p className="text-xs text-stone-500 font-medium">No sales recorded yet.</p>
              <p className="text-[11px] text-stone-400 mt-1">
                Your incoming customer orders will show up here in real-time.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 4).map((order) => (
                <div
                  key={order._id}
                  className="p-4 rounded-2xl border border-parchment-200 bg-parchment-50/40 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-stone-900">
                      Order #{order._id.substring(order._id.length - 6).toUpperCase()}
                    </span>
                    <span className="text-stone-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {order.items?.map((item) => (
                      <div key={item._id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <img
                            src={item.image}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover bg-white"
                          />
                          <span className="font-medium text-stone-800 truncate max-w-[180px]">
                            {item.name} (x{item.quantity})
                          </span>
                        </div>
                        <span className="font-bold text-moss-800">
                          ₹{(item.vendorPayout || item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-parchment-200 flex items-center justify-between text-xs">
                    <span className="text-stone-500">Buyer: {order.buyer?.name}</span>
                    <span className="font-semibold text-stone-800">
                      Status: {order.items?.[0]?.itemStatus || 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Inventory Preview */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-parchment-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-parchment-100 pb-4">
            <h3 className="font-serif font-bold text-xl text-stone-900">Active Works ({products.length})</h3>
            <Link
              to="/vendor/products"
              className="text-xs font-bold text-moss-700 hover:text-moss-900 underline"
            >
              Manage Catalog
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-10 bg-parchment-50 rounded-2xl p-6 space-y-3">
              <p className="text-xs text-stone-600 font-medium">You haven't added any products yet.</p>
              <Link
                to="/vendor/products/new"
                className="inline-block bg-moss-700 text-white text-xs font-bold px-5 py-2.5 rounded-full"
              >
                Add Your First Creation
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {products.slice(0, 5).map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between p-3 rounded-2xl border border-parchment-200 hover:bg-parchment-50/60 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-12 h-12 rounded-xl object-cover bg-parchment-100 border border-parchment-200"
                    />
                    <div>
                      <p className="font-serif font-bold text-stone-900 text-xs truncate max-w-[160px]">
                        {p.name}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        ₹{p.price} • Stock: {p.stock}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/vendor/products/${p._id}/edit`}
                    className="text-xs text-moss-800 font-bold hover:underline"
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
