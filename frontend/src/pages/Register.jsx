import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/axios';
import { setCredentials, setLoading, setError, clearError } from '../store/slices/authSlice';
import { UserPlus, User, Store, AlertCircle } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer'); // 'buyer' or 'vendor'
  const [shopName, setShopName] = useState('');
  const [shopDescription, setShopDescription] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userInfo, loading, error } = useSelector((state) => state.auth);
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    dispatch(clearError());
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      const payload = {
        name,
        email,
        password,
        role,
        shopName: role === 'vendor' ? shopName : undefined,
        shopDescription: role === 'vendor' ? shopDescription : undefined,
      };

      const { data } = await api.post('/auth/register', payload);
      dispatch(setCredentials(data));
      navigate(redirect);
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Registration failed'));
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-parchment-200 p-8 sm:p-10 shadow-warm-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-moss-700 text-parchment-100 flex items-center justify-center font-serif text-2xl mx-auto shadow-sm">
            🌿
          </div>
          <h2 className="font-serif text-3xl font-bold text-stone-900">Create an Account</h2>
          <p className="text-xs text-stone-500">Join our community of mindful makers & craft lovers</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl flex items-center space-x-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Role Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-2 uppercase tracking-wider">
              I am joining as a:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                  role === 'buyer'
                    ? 'border-moss-700 bg-moss-50/60 text-moss-900 font-bold'
                    : 'border-parchment-200 hover:border-parchment-300 text-stone-600'
                }`}
              >
                <User size={18} className={role === 'buyer' ? 'text-moss-700' : 'text-stone-400'} />
                <span className="text-xs mt-1">Shopper / Buyer</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('vendor')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                  role === 'vendor'
                    ? 'border-terracotta-600 bg-terracotta-50/60 text-terracotta-900 font-bold'
                    : 'border-parchment-200 hover:border-parchment-300 text-stone-600'
                }`}
              >
                <Store size={18} className={role === 'vendor' ? 'text-terracotta-600' : 'text-stone-400'} />
                <span className="text-xs mt-1">Artisan Seller</span>
              </button>
            </div>
          </div>

          {/* Basic Fields */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Silas Claymore"
              required
              className="w-full bg-parchment-50 border border-parchment-300 rounded-xl p-3 text-xs text-stone-800 focus:outline-none focus:border-moss-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-parchment-50 border border-parchment-300 rounded-xl p-3 text-xs text-stone-800 focus:outline-none focus:border-moss-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              minLength={6}
              required
              className="w-full bg-parchment-50 border border-parchment-300 rounded-xl p-3 text-xs text-stone-800 focus:outline-none focus:border-moss-600 focus:bg-white"
            />
          </div>

          {/* Extra Vendor Fields */}
          {role === 'vendor' && (
            <div className="bg-parchment-50 border border-parchment-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-terracotta-700">
                <Store size={14} />
                <span>Artisan Workshop Details</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Shop / Studio Name
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="e.g. Earth & Ember Studio"
                  required={role === 'vendor'}
                  className="w-full bg-white border border-parchment-300 rounded-xl p-2.5 text-xs text-stone-800 focus:outline-none focus:border-terracotta-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Short Studio Bio
                </label>
                <textarea
                  rows="2"
                  value={shopDescription}
                  onChange={(e) => setShopDescription(e.target.value)}
                  placeholder="Describe your craft technique and materials..."
                  className="w-full bg-white border border-parchment-300 rounded-xl p-2.5 text-xs text-stone-800 focus:outline-none focus:border-terracotta-600"
                ></textarea>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-moss-700 hover:bg-moss-800 disabled:bg-moss-300 text-white font-bold text-xs py-3.5 rounded-full shadow-warm transition-all flex items-center justify-center space-x-2"
          >
            <UserPlus size={15} />
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
          </button>
        </form>

        <div className="text-center pt-2 border-t border-parchment-100">
          <p className="text-xs text-stone-600">
            Already have an account?{' '}
            <Link
              to={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="text-moss-700 hover:text-moss-800 font-bold underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
