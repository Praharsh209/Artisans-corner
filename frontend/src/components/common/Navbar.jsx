import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  Store,
  Package,
  PlusCircle,
  LogOut,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

const Navbar = () => {
  const [keyword, setKeyword] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const totalCartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
      setKeyword('');
      setMobileMenuOpen(false);
    } else {
      navigate('/products');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setUserDropdownOpen(false);
    navigate('/');
  };

  const isVendor = userInfo && (userInfo.role === 'vendor' || userInfo.role === 'both');

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-parchment-200 shadow-sm transition-all">
      {/* Top banner */}
      <div className="bg-moss-800 text-parchment-100 text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center space-x-2">
        <Sparkles size={13} className="text-terracotta-400" />
        <span>Ethically Crafted • Direct From Independent Artisans • Free Shipping Over ₹999</span>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full bg-moss-700 text-parchment-100 flex items-center justify-center font-serif text-xl font-bold shadow-md group-hover:bg-moss-800 transition-colors">
              🌿
            </div>
            <div>
              <span className="font-serif text-2xl font-bold text-moss-900 tracking-tight block leading-none">
                Artisan's Corner
              </span>
              <span className="text-[10px] uppercase font-sans tracking-widest text-terracotta-600 font-semibold block mt-1">
                Handmade Marketplace
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md mx-8 relative"
          >
            <input
              type="text"
              placeholder="Search handcrafted pottery, textiles, jewelry..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-parchment-50 border border-parchment-300 rounded-full text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-moss-600 focus:ring-1 focus:ring-moss-600 transition-all shadow-inner"
            />
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-moss-700 hover:bg-moss-800 text-white text-xs px-3.5 py-1.5 rounded-full transition-colors font-medium"
            >
              Search
            </button>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Catalog Link */}
            <Link
              to="/products"
              className="hidden sm:inline-flex items-center text-sm font-semibold text-stone-700 hover:text-moss-700 transition-colors"
            >
              Explore Shop
            </Link>

            {/* Vendor CTA button (if not vendor) */}
            {!isVendor && (
              <Link
                to={userInfo ? '/profile' : '/register'}
                className="hidden lg:inline-flex items-center space-x-1 text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 bg-terracotta-50 hover:bg-terracotta-100 border border-terracotta-200 px-3 py-1.5 rounded-full transition-all"
              >
                <Store size={13} />
                <span>Become a Seller</span>
              </Link>
            )}

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 text-stone-700 hover:text-moss-700 transition-colors flex items-center"
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={22} />
              {totalCartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-terracotta-500 text-white text-[11px] font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center shadow-sm">
                  {totalCartCount}
                </span>
              )}
            </Link>

            {/* User Dropdown / Auth Links */}
            {userInfo ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 text-sm font-medium text-stone-800 hover:text-moss-700 py-1 px-2 rounded-lg hover:bg-parchment-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-moss-100 border border-moss-300 text-moss-800 flex items-center justify-center font-bold text-xs">
                    {userInfo.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block max-w-[100px] truncate">{userInfo.name}</span>
                  <ChevronDown size={14} className="text-stone-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-60 bg-white border border-parchment-200 rounded-xl shadow-warm-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-parchment-200">
                      <p className="text-xs text-stone-500 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-stone-900 truncate">{userInfo.name}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider bg-moss-50 text-moss-700 border border-moss-200 px-2 py-0.5 rounded-full">
                        {userInfo.role === 'both' ? 'Buyer & Vendor' : userInfo.role}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2 text-sm text-stone-700 hover:bg-parchment-100 hover:text-moss-800"
                      >
                        <User size={16} />
                        <span>My Account</span>
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2 text-sm text-stone-700 hover:bg-parchment-100 hover:text-moss-800"
                      >
                        <Package size={16} />
                        <span>My Orders</span>
                      </Link>
                    </div>

                    {isVendor && (
                      <div className="border-t border-parchment-200 py-1 bg-parchment-50/60">
                        <div className="px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-moss-800">
                          Vendor Portal
                        </div>
                        <Link
                          to="/vendor/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-4 py-1.5 text-sm text-stone-700 hover:bg-parchment-100 hover:text-moss-800"
                        >
                          <Store size={16} />
                          <span>Vendor Dashboard</span>
                        </Link>
                        <Link
                          to="/vendor/products"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-4 py-1.5 text-sm text-stone-700 hover:bg-parchment-100 hover:text-moss-800"
                        >
                          <Package size={16} />
                          <span>My Products</span>
                        </Link>
                        <Link
                          to="/vendor/products/new"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-4 py-1.5 text-sm text-stone-700 hover:bg-parchment-100 hover:text-moss-800"
                        >
                          <PlusCircle size={16} />
                          <span>Add New Product</span>
                        </Link>
                      </div>
                    )}

                    <div className="border-t border-parchment-200 pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-stone-700 hover:text-moss-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-moss-700 hover:bg-moss-800 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-sm hover:shadow transition-all"
                >
                  Join Market
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-moss-700 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-parchment-200 px-4 pt-2 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-150">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search handmade goods..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-parchment-50 border border-parchment-300 rounded-lg text-sm"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />
          </form>

          <div className="flex flex-col space-y-2 pt-2 border-t border-parchment-100 font-medium">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-stone-800 hover:bg-parchment-100 rounded-md"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-stone-800 hover:bg-parchment-100 rounded-md"
            >
              Browse All Products
            </Link>
            {userInfo && (
              <>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-stone-800 hover:bg-parchment-100 rounded-md"
                >
                  My Orders
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-stone-800 hover:bg-parchment-100 rounded-md"
                >
                  My Profile
                </Link>
              </>
            )}
            {isVendor && (
              <div className="border-t border-parchment-200 pt-2">
                <p className="px-3 text-xs uppercase font-bold text-moss-800">Vendor Management</p>
                <Link
                  to="/vendor/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-stone-800 hover:bg-parchment-100 rounded-md"
                >
                  Vendor Dashboard
                </Link>
                <Link
                  to="/vendor/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-stone-800 hover:bg-parchment-100 rounded-md"
                >
                  Manage Products
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
