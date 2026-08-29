import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Upload,
  Image as ImageIcon,
  ArrowLeft,
  Check,
  AlertCircle,
  Plus,
  Trash2,
  Sparkles,
} from 'lucide-react';

const FALLBACK_CATEGORIES = [
  { name: 'Pottery & Ceramics' },
  { name: 'Handwoven Textiles' },
  { name: 'Handcrafted Jewelry' },
  { name: 'Woodcraft & Utensils' },
  { name: 'Candles & Botanicals' },
  { name: 'Leather Goods' },
];

const AddEditProduct = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [tags, setTags] = useState('');
  const [images, setImages] = useState([]);
  const [directImageUrl, setDirectImageUrl] = useState('');

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch categories & existing product (if edit mode)
  useEffect(() => {
    const initData = async () => {
      try {
        setLoadingInitial(true);
        let activeCategories = FALLBACK_CATEGORIES;

        try {
          const { data: catData } = await api.get('/categories');
          if (Array.isArray(catData) && catData.length > 0) {
            activeCategories = catData;
            setCategories(catData);
          }
        } catch (catErr) {
          console.warn('Could not fetch categories from server, using default craft categories:', catErr);
        }

        if (isEditMode) {
          const { data: prodData } = await api.get(`/products/${id}`);
          setName(prodData.name || '');
          setDescription(prodData.description || '');
          setCategory(prodData.category || activeCategories[0]?.name || '');
          setPrice(String(prodData.price !== undefined ? prodData.price : ''));
          setStock(String(prodData.stock !== undefined ? prodData.stock : '1'));
          setTags(Array.isArray(prodData.tags) ? prodData.tags.join(', ') : '');
          setImages(Array.isArray(prodData.images) ? prodData.images : []);
        } else {
          setCategory(activeCategories[0]?.name || 'Pottery & Ceramics');
        }
      } catch (err) {
        setErrorMessage(err.response?.data?.message || 'Failed to initialize product form');
      } finally {
        setLoadingInitial(false);
      }
    };

    initData();
  }, [id, isEditMode]);

  // Handle Image File Upload via Cloudinary / backend upload API
  const handleFileUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadingImage(true);
      setErrorMessage('');

      const { data } = await api.post('/upload', formData);

      if (data.url) {
        setImages((prev) => [...prev, data.url]);
        setSuccessMessage('Product photo uploaded successfully!');
        setTimeout(() => setSuccessMessage(''), 2500);
      } else {
        throw new Error('Upload succeeded but no image URL was returned');
      }
    } catch (err) {
      console.error('Upload Error:', err);
      setErrorMessage(
        err.response?.data?.message || 'Image upload failed. You can also paste an image URL directly below.'
      );
    } finally {
      setUploadingImage(false);
      // Reset input value so same file can be selected again if needed
      e.target.value = '';
    }
  };

  // Handle direct image URL adding
  const handleAddDirectUrl = () => {
    if (directImageUrl.trim()) {
      setImages((prev) => [...prev, directImageUrl.trim()]);
      setDirectImageUrl('');
      setErrorMessage('');
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages(images.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMessage('Please provide a title for your handcrafted creation.');
      return;
    }

    if (!category.trim()) {
      setErrorMessage('Please select a craft category.');
      return;
    }

    if (!price || Number(price) <= 0) {
      setErrorMessage('Please specify a valid price in INR (₹).');
      return;
    }

    if (stock === '' || Number(stock) < 0) {
      setErrorMessage('Please specify available stock count.');
      return;
    }

    if (!description.trim()) {
      setErrorMessage('Please provide a detailed craft description.');
      return;
    }

    if (images.length === 0) {
      setErrorMessage('Please upload or attach at least one product photo.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage('');

      const payload = {
        name: name.trim(),
        description: description.trim(),
        category: category.trim(),
        price: Number(price),
        stock: Number(stock),
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        images,
      };

      if (isEditMode) {
        await api.put(`/products/${id}`, payload);
        setSuccessMessage('Handcrafted piece updated successfully!');
      } else {
        await api.post('/products', payload);
        setSuccessMessage('New handcrafted creation published to your studio inventory!');
      }

      setTimeout(() => {
        navigate('/vendor/products');
      }, 1000);
    } catch (err) {
      console.error('Submit Product Error:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to save product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInitial) {
    return <LoadingSpinner message="Opening workshop canvas..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <Link
          to="/vendor/products"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-500 hover:text-moss-800 mb-2 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Studio Inventory</span>
        </Link>
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          {isEditMode ? 'Edit Handcrafted Piece' : 'Publish New Handcrafted Creation'}
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Provide craft specifications, authentic photography, INR pricing, and available stock.
        </p>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-2xl flex items-center space-x-2 shadow-xs">
          <AlertCircle size={18} className="shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="bg-moss-50 border border-moss-200 text-moss-800 text-xs p-4 rounded-2xl flex items-center space-x-2 shadow-xs">
          <Check size={18} className="shrink-0 text-moss-700" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Information */}
        <div className="bg-white rounded-3xl border border-parchment-200 p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="font-serif font-bold text-lg text-stone-900 border-b border-parchment-100 pb-3">
            1. Creation Details & Pricing
          </h2>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
              Piece Title / Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Hand-Painted Blue Pottery Ceramic Teapot"
              required
              className="w-full bg-parchment-50 border border-parchment-300 rounded-xl p-3 text-xs text-stone-800 focus:outline-none focus:border-moss-600 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
                Craft Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full bg-parchment-50 border border-parchment-300 rounded-xl p-3 text-xs text-stone-800 focus:outline-none focus:border-moss-600 focus:bg-white"
              >
                {categories.map((c) => (
                  <option key={c._id || c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
                Price in INR (₹) *
              </label>
              <input
                type="number"
                step="1"
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1250"
                required
                className="w-full bg-parchment-50 border border-parchment-300 rounded-xl p-3 text-xs text-stone-800 focus:outline-none focus:border-moss-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
                Available Stock Units *
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="10"
                required
                className="w-full bg-parchment-50 border border-parchment-300 rounded-xl p-3 text-xs text-stone-800 focus:outline-none focus:border-moss-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
              Detailed Craft Story & Description *
            </label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the raw materials, craft tradition, dimensions, artisan touch, and care instructions..."
              required
              className="w-full bg-parchment-50 border border-parchment-300 rounded-xl p-3 text-xs text-stone-800 focus:outline-none focus:border-moss-600 focus:bg-white"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 uppercase tracking-wider">
              Keywords & Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="pottery, teapot, blue pottery, handcrafted, jaipur"
              className="w-full bg-parchment-50 border border-parchment-300 rounded-xl p-3 text-xs text-stone-800 focus:outline-none focus:border-moss-600 focus:bg-white"
            />
          </div>
        </div>

        {/* Section 2: Studio Photography */}
        <div className="bg-white rounded-3xl border border-parchment-200 p-6 sm:p-8 shadow-sm space-y-5">
          <h2 className="font-serif font-bold text-lg text-stone-900 border-b border-parchment-100 pb-3">
            2. Product Photography (Cloudinary / File Upload)
          </h2>

          {/* Upload Drop Area */}
          <div className="border-2 border-dashed border-parchment-300 hover:border-moss-600 rounded-2xl p-6 text-center bg-parchment-50/60 hover:bg-parchment-50 transition-colors">
            <input
              type="file"
              id="imageUploadInput"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploadingImage}
            />
            <label
              htmlFor="imageUploadInput"
              className={`cursor-pointer flex flex-col items-center justify-center space-y-2 ${
                uploadingImage ? 'opacity-60 pointer-events-none' : ''
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-moss-50 text-moss-700 flex items-center justify-center shadow-xs">
                <Upload size={22} />
              </div>
              <p className="text-xs font-bold text-stone-900">
                {uploadingImage ? 'Uploading Image to Server...' : 'Click to Upload High-Resolution Image'}
              </p>
              <p className="text-[11px] text-stone-500">Supports JPG, PNG, WebP up to 10MB</p>
            </label>
          </div>

          {/* Alternative URL Input */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Or attach an Image by Direct URL:
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="url"
                value={directImageUrl}
                onChange={(e) => setDirectImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="flex-1 bg-parchment-50 border border-parchment-300 rounded-xl p-2.5 text-xs text-stone-800 focus:outline-none focus:border-moss-600"
              />
              <button
                type="button"
                onClick={handleAddDirectUrl}
                className="bg-moss-700 hover:bg-moss-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shrink-0"
              >
                Attach URL
              </button>
            </div>
          </div>

          {/* Current Images Preview Strip */}
          {images.length > 0 && (
            <div className="pt-4 border-t border-parchment-100 space-y-2">
              <p className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Attached Creation Images ({images.length})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-2xl overflow-hidden bg-parchment-100 border border-parchment-200 group shadow-xs"
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-2 left-2 bg-moss-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        Primary Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-sm"
                      title="Remove image"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex items-center space-x-4">
          <button
            type="submit"
            disabled={submitting || uploadingImage}
            className="flex-1 bg-moss-700 hover:bg-moss-800 disabled:bg-moss-300 text-white font-bold text-xs py-4 rounded-full shadow-warm hover:shadow-warm-lg transition-all flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <span>Saving Creation to Marketplace...</span>
            ) : isEditMode ? (
              <span>Update Handcrafted Piece</span>
            ) : (
              <span>Publish Piece to Marketplace</span>
            )}
          </button>
          <Link
            to="/vendor/products"
            className="px-6 py-4 bg-white hover:bg-parchment-100 border border-parchment-300 text-stone-800 text-xs font-bold rounded-full transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AddEditProduct;
