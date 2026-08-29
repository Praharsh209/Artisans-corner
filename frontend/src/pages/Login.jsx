import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/axios';
import { setCredentials, setLoading, setError, clearError } from '../store/slices/authSlice';
import { LogIn, User, Store, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      const { data } = await api.post('/auth/login', { email, password });
      dispatch(setCredentials(data));
      navigate(redirect);
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Login failed. Please check credentials.'));
    }
  };

  const handleFillDemo = (type) => {
    if (type === 'buyer') {
      setEmail('buyer@artisans.com');
      setPassword('buyer123');
    } else if (type === 'vendor') {
      setEmail('vendor@artisans.com');
      setPassword('vendor123');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl border border-parchment-200 p-8 sm:p-10 shadow-warm-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-moss-700 text-parchment-100 flex items-center justify-center font-serif text-2xl mx-auto shadow-sm">
            🌿
          </div>
          <h2 className="font-serif text-3xl font-bold text-stone-900">Welcome Back</h2>
          <p className="text-xs text-stone-500">Sign in to your Artisan's Corner account</p>
        </div>

        {/* Quick Demo Pre-fill helper box */}
        <div className="bg-parchment-50 border border-parchment-200 rounded-2xl p-3.5 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-moss-800 text-center">
            ⚡ Quick Demo Accounts
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('buyer')}
              className="flex items-center justify-center space-x-1.5 bg-white hover:bg-moss-50 border border-parchment-300 hover:border-moss-600 text-stone-800 text-xs font-semibold py-2 px-3 rounded-xl transition-all shadow-xs"
            >
              <User size={13} className="text-moss-600" />
              <span>Demo Buyer</span>
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('vendor')}
              className="flex items-center justify-center space-x-1.5 bg-white hover:bg-terracotta-50 border border-parchment-300 hover:border-terracotta-600 text-stone-800 text-xs font-semibold py-2 px-3 rounded-xl transition-all shadow-xs"
            >
              <Store size={13} className="text-terracotta-600" />
              <span>Demo Vendor</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl flex items-center space-x-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full bg-parchment-50 border border-parchment-300 rounded-xl p-3 text-xs text-stone-800 focus:outline-none focus:border-moss-600 focus:bg-white transition-colors"
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
              placeholder="••••••••"
              required
              className="w-full bg-parchment-50 border border-parchment-300 rounded-xl p-3 text-xs text-stone-800 focus:outline-none focus:border-moss-600 focus:bg-white transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-moss-700 hover:bg-moss-800 disabled:bg-moss-300 text-white font-bold text-xs py-3.5 rounded-full shadow-warm transition-all flex items-center justify-center space-x-2"
          >
            <LogIn size={15} />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="text-center pt-2 border-t border-parchment-100">
          <p className="text-xs text-stone-600">
            Don't have an account?{' '}
            <Link
              to={`/register?redirect=${encodeURIComponent(redirect)}`}
              className="text-terracotta-600 hover:text-terracotta-700 font-bold underline"
            >
              Join the marketplace
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
