import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import RatingStars from '../../components/common/RatingStars';
import {
  Package,
  PlusCircle,
  Edit2,
  Trash2,
  AlertCircle,
  Check,
  Search,
  ExternalLink,
} from 'lucide-react';

const VendorProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const fetchVendorProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products/vendor/my-products');
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorProducts();
  }, []);

  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      setDeleteConfirmId(null);
      setFeedbackMessage('Product removed successfully.');
      setTimeout(() => setFeedbackMessage(''), 2500);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner message="Loading your studio workshop catalog..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-parchment-200 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            Studio Inventory Management
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage, edit, and publish handcrafted pieces ({products.length} active items)
          </p>
        </div>

        <Link
          to="/vendor/products/new"
          className="inline-flex items-center space-x-1.5 bg-moss-700 hover:bg-moss-800 text-white text-xs font-bold px-6 py-3 rounded-full shadow-warm transition-all"
        >
          <PlusCircle size={16} />
          <span>Add New Creation</span>
        </Link>
      </div>

      {feedbackMessage && (
        <div className="bg-moss-50 border border-moss-200 text-moss-800 text-xs p-4 rounded-2xl flex items-center space-x-2">
          <Check size={16} className="text-moss-700" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Search Filter Bar */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Filter by piece title or category..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-full bg-white border border-parchment-300 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-stone-800 focus:outline-none focus:border-moss-600 shadow-xs"
        />
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
        />
      </div>

      {/* Products Table */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-parchment-200 p-12 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-parchment-100 text-moss-700 flex items-center justify-center mx-auto text-2xl">
            🎨
          </div>
          <h3 className="font-serif font-bold text-xl text-stone-900">
            {searchFilter ? 'No Matching Products' : 'No Products in Your Studio Yet'}
          </h3>
          <p className="text-xs text-stone-500">
            {searchFilter
              ? 'Try changing your search term.'
              : 'Add your first handmade piece with photography and pricing.'}
          </p>
          {!searchFilter && (
            <Link
              to="/vendor/products/new"
              className="inline-block bg-moss-700 text-white text-xs font-bold px-6 py-3 rounded-full shadow-sm"
            >
              Publish New Creation
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-parchment-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-parchment-50 border-b border-parchment-200 text-stone-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Product Details</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Inventory Stock</th>
                  <th className="py-4 px-4">Rating</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-parchment-100">
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-parchment-50/50 transition-colors">
                    {/* Details */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <img
                          src={p.images[0]}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover bg-parchment-100 border border-parchment-200 shrink-0"
                        />
                        <div>
                          <p className="font-serif font-bold text-stone-900 text-sm">{p.name}</p>
                          <Link
                            to={`/product/${p._id}`}
                            target="_blank"
                            className="inline-flex items-center space-x-1 text-[11px] text-stone-400 hover:text-moss-700 mt-0.5"
                          >
                            <span>View Public Page</span>
                            <ExternalLink size={10} />
                          </Link>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4">
                      <span className="bg-parchment-100 text-stone-700 px-2.5 py-1 rounded-full text-[11px] font-medium">
                        {p.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4 font-serif font-bold text-sm text-moss-900">
                      ₹{Number(p.price).toFixed(2)}
                    </td>

                    {/* Stock */}
                    <td className="py-4 px-4">
                      {p.stock === 0 ? (
                        <span className="text-red-600 font-bold bg-red-50 border border-red-200 px-2 py-0.5 rounded text-[10px]">
                          Out of Stock
                        </span>
                      ) : p.stock <= 3 ? (
                        <span className="text-amber-700 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[10px]">
                          Low ({p.stock} left)
                        </span>
                      ) : (
                        <span className="text-stone-700 font-semibold">{p.stock} units</span>
                      )}
                    </td>

                    {/* Rating */}
                    <td className="py-4 px-4">
                      <RatingStars rating={p.averageRating || 5} numReviews={p.numReviews || 0} size={13} />
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right space-x-2">
                      <Link
                        to={`/vendor/products/${p._id}/edit`}
                        className="inline-flex items-center space-x-1 p-2 bg-parchment-100 hover:bg-moss-700 hover:text-white text-stone-700 rounded-xl transition-all"
                        title="Edit Piece"
                      >
                        <Edit2 size={14} />
                      </Link>

                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(p._id)}
                        className="inline-flex items-center space-x-1 p-2 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-xl transition-all"
                        title="Delete Piece"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-parchment-200 p-6 sm:p-8 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-serif font-bold text-lg text-stone-900">Remove Creation?</h3>
              <p className="text-xs text-stone-500">
                Are you sure you want to delete this piece from your workshop? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-3 rounded-full transition-all"
              >
                Yes, Delete
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 bg-parchment-100 hover:bg-parchment-200 text-stone-800 text-xs font-bold py-3 rounded-full transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProducts;
