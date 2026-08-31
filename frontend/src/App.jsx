import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import VendorRoute from './components/common/VendorRoute';

// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';

// Buyer Protected Pages
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderHistory from './pages/OrderHistory';
import OrderDetails from './pages/OrderDetails';
import Profile from './pages/Profile';

// Vendor Protected Pages
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorProducts from './pages/vendor/VendorProducts';
import AddEditProduct from './pages/vendor/AddEditProduct';
import VendorOrders from './pages/vendor/VendorOrders';
import ShopProfile from './pages/vendor/ShopProfile';

// Scroll to top helper on route transitions
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// 404 Page
const NotFound = () => (
  <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
    <div className="w-16 h-16 rounded-full bg-parchment-100 text-stone-600 flex items-center justify-center mx-auto text-3xl">
      🌿
    </div>
    <h1 className="font-serif text-3xl font-bold text-stone-900">404 - Studio Page Not Found</h1>
    <p className="text-xs text-stone-500 max-w-md mx-auto">
      The handcrafted page you are looking for has been moved or does not exist.
    </p>
    <Link
      to="/"
      className="inline-block bg-moss-700 hover:bg-moss-800 text-white font-bold text-xs px-6 py-3 rounded-full transition-all shadow-sm"
    >
      Return to Marketplace
    </Link>
  </div>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-parchment-50 text-earth-dark selection:bg-moss-100 selection:text-moss-900">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />

            {/* Buyer Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success/:id" element={<OrderSuccess />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/orders/:id" element={<OrderDetails />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Vendor Protected Routes */}
            <Route element={<VendorRoute />}>
              <Route path="/vendor/dashboard" element={<VendorDashboard />} />
              <Route path="/vendor/products" element={<VendorProducts />} />
              <Route path="/vendor/products/new" element={<AddEditProduct />} />
              <Route path="/vendor/products/:id/edit" element={<AddEditProduct />} />
              <Route path="/vendor/orders" element={<VendorOrders />} />
              <Route path="/vendor/shop-profile" element={<ShopProfile />} />
            </Route>

            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
