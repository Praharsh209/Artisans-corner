import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../api/axios';
import { updateUser } from '../../store/slices/authSlice';
import { Store, Image, Check, AlertCircle, Sparkles } from 'lucide-react';

const ShopProfile = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [shopName, setShopName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');
  const [banner, setBanner] = useState('');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (userInfo && userInfo.shopProfile) {
      setShopName(userInfo.shopProfile.shopName || '');
      setDescription(userInfo.shopProfile.description || '');
      setLogo(userInfo.shopProfile.logo || '');
      setBanner(userInfo.shopProfile.banner || '');
    }
  }, [userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const { data } = await api.put('/auth/profile', {
        shopProfile: {
          shopName,
          description,
          logo,
          banner,
        },
      });

      dispatch(updateUser(data));
      setSuccess('Studio storefront profile saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update shop profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          Studio Storefront Profile
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Customize your workshop identity, banner photography, and artisan story seen by buyers
        </p>
      </div>

      {success && (
        <div className="bg-moss-50 border border-moss-200 text-moss-800 text-xs p-4 rounded-2xl flex items-center space-x-2">
          <Check size={18} className="text-moss-700" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-2xl flex items-center space-x-2">
          <AlertCircle size={18} className="text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Live Preview Card */}
      <div className="bg-white rounded-3xl border border-parchment-200 overflow-hidden shadow-sm">
        <p className="px-6 pt-4 text-[10px] font-bold uppercase tracking-wider text-stone-400">
          Live Storefront Header Preview
        </p>
        <div className="h-36 w-full bg-stone-200 relative overflow-hidden mt-2">
          {banner ? (
            <img src={banner} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-moss-800 to-moss-900 flex items-center justify-center text-parchment-200 text-xs font-semibold">
              Add a Studio Banner Photography URL
            </div>
          )}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="px-6 pb-6 pt-0 relative flex items-end justify-between">
          <div className="flex items-end space-x-4 -mt-10">
            <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md bg-parchment-100 overflow-hidden shrink-0 flex items-center justify-center">
              {logo ? (
                <img src={logo} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl">🏺</span>
              )}
            </div>
            <div className="pb-1">
              <h2 className="font-serif font-bold text-xl text-stone-900">
                {shopName || 'Your Studio Name'}
              </h2>
              <p className="text-xs text-stone-500">Maker: {userInfo?.name}</p>
            </div>
          </div>
        </div>

        {description && (
          <div className="px-6 pb-6 text-xs text-stone-600 border-t border-parchment-100 pt-3">
            {description}
          </div>
        )}
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-parchment-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
            Studio / Shop Name
          </label>
          <input
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="e.g. Earth & Ember Ceramics"
            required
            className="w-full bg-parchment-50 border border-parchment-300 rounded-xl p-3 text-xs text-stone-800 focus:outline-none focus:border-moss-600 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
            Maker Story / Studio Bio
          </label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your craft disciplines, philosophy, materials, and workshop location..."
            className="w-full bg-parchment-50 border border-parchment-300 rounded-xl p-3 text-xs text-stone-800 focus:outline-none focus:border-moss-600 focus:bg-white"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
              Logo / Avatar Image URL
            </label>
            <input
              type="url"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full bg-parchment-50 border border-parchment-300 rounded-xl p-3 text-xs text-stone-800 focus:outline-none focus:border-moss-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
              Studio Banner Image URL
            </label>
            <input
              type="url"
              value={banner}
              onChange={(e) => setBanner(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full bg-parchment-50 border border-parchment-300 rounded-xl p-3 text-xs text-stone-800 focus:outline-none focus:border-moss-600 focus:bg-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-moss-700 hover:bg-moss-800 disabled:bg-moss-300 text-white font-bold text-xs py-3.5 rounded-full shadow-warm transition-all"
        >
          {saving ? 'Saving Studio Settings...' : 'Save Studio Profile'}
        </button>
      </form>
    </div>
  );
};

export default ShopProfile;
