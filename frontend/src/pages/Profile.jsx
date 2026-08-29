import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { updateUser } from '../store/slices/authSlice';
import {
  User,
  Store,
  MapPin,
  Lock,
  Check,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const Profile = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  // Profile Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Shipping Address Form
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  // Become a Vendor Form
  const [shopName, setShopName] = useState('');
  const [shopDescription, setShopDescription] = useState('');
  const [showVendorModal, setShowVendorModal] = useState(false);

  // Feedback states
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name || '');
      setEmail(userInfo.email || '');
      setAddress({
        street: userInfo.address?.street || '',
        city: userInfo.address?.city || '',
        state: userInfo.address?.state || '',
        postalCode: userInfo.address?.postalCode || '',
        country: userInfo.address?.country || 'India',
      });
      if (userInfo.shopProfile) {
        setShopName(userInfo.shopProfile.shopName || '');
        setShopDescription(userInfo.shopProfile.description || '');
      }
    }
  }, [userInfo]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      setProfileError('Passwords do not match');
      return;
    }

    try {
      setSaving(true);
      setProfileError('');
      setProfileSuccess('');

      const updateData = {
        name,
        email,
        address,
      };
      if (password) {
        updateData.password = password;
      }

      const { data } = await api.put('/auth/profile', updateData);
      dispatch(updateUser(data));
      setProfileSuccess('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleBecomeVendor = async (e) => {
    e.preventDefault();
    if (!shopName.trim()) {
      setProfileError('Please specify a shop/studio name');
      return;
    }

    try {
      setSaving(true);
      setProfileError('');
      const { data } = await api.post('/auth/become-vendor', {
        shopName,
        description: shopDescription,
      });
      dispatch(updateUser(data));
      setShowVendorModal(false);
      setProfileSuccess('Congratulations! You are now registered as an Artisan Seller.');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to upgrade to vendor');
    } finally {
      setSaving(false);
    }
  };

  const isVendor = userInfo && (userInfo.role === 'vendor' || userInfo.role === 'both');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-parchment-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Account & Preferences
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage your personal credentials, delivery addresses, and artisan seller status
          </p>
        </div>

        {/* Role Badge */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider bg-moss-50 border border-moss-200 text-moss-800 px-3 py-1.5 rounded-full">
            Account Role: {userInfo?.role === 'both' ? 'Buyer & Vendor' : userInfo?.role}
          </span>
        </div>
      </div>

      {profileSuccess && (
        <div className="bg-moss-50 border border-moss-200 text-moss-800 text-xs p-4 rounded-2xl flex items-center space-x-2">
          <Check size={18} className="text-moss-700" />
          <span>{profileSuccess}</span>
        </div>
      )}

      {profileError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-2xl flex items-center space-x-2">
          <AlertCircle size={18} className="text-red-600" />
          <span>{profileError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: User Profile & Address Update */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-parchment-200 p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="font-serif font-bold text-xl text-stone-900 border-b border-parchment-100 pb-3">
            Personal Information
          </h3>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                required
                className="w-full bg-parchment-50 border border-parchment-300 rounded-xl p-3 text-xs text-stone-800 focus:outline-none focus:border-moss-600 focus:bg-white"
              />
            </div>

            <div className="pt-4 border-t border-parchment-100 space-y-3">
              <h4 className="font-serif font-bold text-base text-stone-900 flex items-center space-x-1.5">
                <MapPin size={16} className="text-moss-700" />
                <span>Default Shipping Address</span>
              </h4>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  placeholder="742 Evergreen Terrace"
                  className="w-full bg-parchment-50 border border-parchment-300 rounded-xl p-2.5 text-xs text-stone-800 focus:outline-none focus:border-moss-600"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">City</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="Bengaluru"
                    className="w-full bg-parchment-50 border border-parchment-300 rounded-xl p-2.5 text-xs text-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">State</label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    placeholder="Karnataka"
                    className="w-full bg-parchment-50 border border-parchment-300 rounded-xl p-2.5 text-xs text-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    placeholder="560038"
                    className="w-full bg-parchment-50 border border-parchment-300 rounded-xl p-2.5 text-xs text-stone-800"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-parchment-100 space-y-3">
              <h4 className="font-serif font-bold text-base text-stone-900 flex items-center space-x-1.5">
                <Lock size={16} className="text-moss-700" />
                <span>Change Password (Leave blank to keep current)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-parchment-50 border border-parchment-300 rounded-xl p-2.5 text-xs text-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-parchment-50 border border-parchment-300 rounded-xl p-2.5 text-xs text-stone-800"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-moss-700 hover:bg-moss-800 disabled:bg-moss-300 text-white font-bold text-xs py-3.5 rounded-full shadow-warm transition-all"
            >
              {saving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Right: Vendor Status Box */}
        <div className="lg:col-span-5 space-y-6">
          {isVendor ? (
            <div className="bg-white rounded-3xl border border-parchment-200 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-terracotta-600">
                <Store size={20} />
                <h3 className="font-serif font-bold text-xl text-stone-900">
                  Artisan Studio Seller
                </h3>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                You are registered as an artisan seller. You can publish your handcrafted works, track sales, and fulfill customer orders.
              </p>

              <div className="bg-parchment-50 rounded-2xl p-4 border border-parchment-200 space-y-1">
                <p className="text-xs font-bold text-stone-900">
                  {userInfo.shopProfile?.shopName || `${userInfo.name}'s Studio`}
                </p>
                <p className="text-[11px] text-stone-500 line-clamp-2">
                  {userInfo.shopProfile?.description || 'Active Handmade Maker'}
                </p>
              </div>

              <div className="pt-2 space-y-2">
                <Link
                  to="/vendor/dashboard"
                  className="w-full inline-flex items-center justify-center space-x-2 bg-moss-700 hover:bg-moss-800 text-white text-xs font-bold py-3 rounded-full shadow-sm transition-all"
                >
                  <Store size={15} />
                  <span>Open Vendor Dashboard</span>
                </Link>

                <Link
                  to="/vendor/shop-profile"
                  className="w-full inline-flex items-center justify-center space-x-2 bg-parchment-100 hover:bg-parchment-200 text-stone-800 text-xs font-semibold py-2.5 rounded-full border border-parchment-300 transition-all"
                >
                  <span>Edit Studio Profile & Banner</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-moss-800 to-moss-900 text-white rounded-3xl p-6 sm:p-8 shadow-warm-lg space-y-4">
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-terracotta-400 bg-moss-700/60 px-3 py-1 rounded-full">
                <Sparkles size={13} />
                <span>Become a Maker</span>
              </div>

              <h3 className="font-serif text-2xl font-bold text-white">
                Want to sell your handcrafted pieces?
              </h3>

              <p className="text-xs text-parchment-200 leading-relaxed">
                Join our curated guild of ceramicists, woodworkers, and artisans. List your creations and keep 95% of every sale with direct Stripe payouts.
              </p>

              {!showVendorModal ? (
                <button
                  type="button"
                  onClick={() => setShowVendorModal(true)}
                  className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs py-3.5 rounded-full shadow-sm transition-all"
                >
                  Open an Artisan Studio
                </button>
              ) : (
                <form onSubmit={handleBecomeVendor} className="space-y-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-parchment-100 mb-1">
                      Shop / Studio Name
                    </label>
                    <input
                      type="text"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      placeholder="e.g. Earth & Ember Studio"
                      required
                      className="w-full bg-white text-stone-900 rounded-xl p-2.5 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-parchment-100 mb-1">
                      Short Studio Bio
                    </label>
                    <textarea
                      rows="2"
                      value={shopDescription}
                      onChange={(e) => setShopDescription(e.target.value)}
                      placeholder="Describe your craft..."
                      className="w-full bg-white text-stone-900 rounded-xl p-2.5 text-xs focus:outline-none"
                    ></textarea>
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs py-2.5 rounded-full"
                    >
                      {saving ? 'Registering...' : 'Confirm Seller Account'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowVendorModal(false)}
                      className="px-4 py-2.5 bg-moss-700 hover:bg-moss-600 text-white text-xs rounded-full"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
