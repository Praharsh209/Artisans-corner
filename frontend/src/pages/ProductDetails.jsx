import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/axios';
import { addToCart } from '../store/slices/cartSlice';
import RatingStars from '../components/common/RatingStars';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  ShoppingBag,
  Check,
  Store,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Plus,
  Minus,
  MessageSquare,
  AlertCircle,
  BadgeCheck,
  Star,
} from 'lucide-react';

const RATING_LABELS = {
  1: '1 Star - Poor quality',
  2: '2 Stars - Fair craft',
  3: '3 Stars - Good piece',
  4: '4 Stars - Great craftsmanship',
  5: '5 Stars - Exceptional masterpiece',
};

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Eligibility state
  const [eligibility, setEligibility] = useState({
    hasPurchased: false,
    alreadyReviewed: false,
    canReview: false,
    loading: false,
  });

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      if (data.images && data.images.length > 0) {
        setSelectedImage(data.images[0]);
      }
    } catch (err) {
      console.error('Failed to fetch product details:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEligibility = async () => {
    if (!userInfo) return;
    try {
      setEligibility((prev) => ({ ...prev, loading: true }));
      const { data } = await api.get(`/products/${id}/review-eligibility`);
      setEligibility({
        hasPurchased: data.hasPurchased,
        alreadyReviewed: data.alreadyReviewed,
        canReview: data.canReview,
        loading: false,
      });
    } catch (err) {
      console.warn('Could not check review eligibility:', err.message);
      setEligibility((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product && userInfo) {
      fetchEligibility();
    }
  }, [id, userInfo, product?._id]);

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;

    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        stock: product.stock,
        vendor: product.vendor?._id || product.vendor,
        quantity: Number(quantity),
      })
    );

    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2200);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setReviewError('Please provide a comment for your review.');
      return;
    }

    try {
      setReviewSubmitting(true);
      setReviewError('');
      const { data } = await api.post(`/products/${id}/reviews`, {
        rating: Number(rating),
        comment: comment.trim(),
      });

      setReviewSuccess('Thank you! Your verified artisan review has been published.');
      setComment('');

      // Update local product state with new review & updated rating immediately
      if (data.reviews) {
        setProduct((prev) => ({
          ...prev,
          reviews: data.reviews,
          averageRating: data.averageRating,
          numReviews: data.numReviews,
        }));
      } else {
        fetchProduct();
      }

      setEligibility((prev) => ({
        ...prev,
        alreadyReviewed: true,
        canReview: false,
      }));
    } catch (err) {
      console.error('Review submit error:', err);
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Fetching handcrafted details from workshop..." />;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-stone-800">Product Not Found</h2>
        <Link
          to="/products"
          className="mt-4 inline-block bg-moss-700 text-white text-xs font-bold px-6 py-2.5 rounded-full"
        >
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const vendorShopName =
    product.vendor?.shopProfile?.shopName || product.vendor?.name || 'Jaipur Artisan Studio';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb navigation */}
      <nav className="text-xs font-medium text-stone-500 mb-6 flex items-center space-x-2">
        <Link to="/" className="hover:text-moss-800">
          Home
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-moss-800">
          Shop
        </Link>
        <span>/</span>
        <Link
          to={`/products?category=${encodeURIComponent(product.category)}`}
          className="hover:text-moss-800"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-stone-900 font-semibold truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* Main Grid: Gallery + Purchasing Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        {/* Left: Product Images */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-white border border-parchment-300 shadow-sm relative">
            <img
              src={selectedImage || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs text-moss-800 text-xs font-semibold px-3 py-1 rounded-full shadow-xs">
              {product.category}
            </span>
          </div>

          {/* Thumbnail Strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImage === img
                      ? 'border-moss-700 ring-2 ring-moss-700/20'
                      : 'border-parchment-200 hover:border-parchment-400'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Meta & Purchase Box */}
        <div className="lg:col-span-5 space-y-6">
          {/* Artisan Studio Info */}
          <div className="flex items-center space-x-2 text-xs text-stone-500">
            <Store size={14} className="text-terracotta-600" />
            <span>Crafted by</span>
            <span className="font-semibold text-stone-900">{vendorShopName}</span>
          </div>

          {/* Title & Ratings */}
          <div className="space-y-2">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center space-x-3 pt-1">
              <RatingStars
                rating={product.averageRating || 5}
                numReviews={product.numReviews || product.reviews?.length || 0}
                size={16}
              />
              <span className="text-xs text-stone-400">•</span>
              <span className="text-xs font-bold text-moss-700 bg-moss-50 px-2 py-0.5 rounded-full">
                Handmade in India
              </span>
            </div>
          </div>

          {/* Price & Stock */}
          <div className="p-5 bg-white rounded-3xl border border-parchment-200 shadow-xs space-y-4">
            <div className="flex items-baseline space-x-3">
              <span className="font-serif text-3xl font-bold text-moss-900">
                ₹{Number(product.price).toFixed(2)}
              </span>
              <span className="text-xs text-stone-400">Taxes calculated at checkout</span>
            </div>

            {/* Stock status */}
            <div>
              {product.stock > 0 ? (
                <div className="flex items-center space-x-2 text-xs font-semibold text-moss-800">
                  <span className="w-2 h-2 rounded-full bg-moss-600 animate-pulse"></span>
                  <span>In Stock ({product.stock} available units)</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-xs font-semibold text-red-600">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  <span>Currently Out of Stock</span>
                </div>
              )}
            </div>

            {/* Quantity Selector & Add to Basket */}
            {product.stock > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center space-x-3">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Quantity:
                  </label>
                  <div className="flex items-center border border-parchment-300 rounded-full bg-parchment-50 p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-7 h-7 rounded-full bg-white text-stone-700 flex items-center justify-center hover:bg-parchment-200 disabled:opacity-40 transition-colors shadow-xs"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-stone-800">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="w-7 h-7 rounded-full bg-white text-stone-700 flex items-center justify-center hover:bg-parchment-200 disabled:opacity-40 transition-colors shadow-xs"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full bg-moss-700 hover:bg-moss-800 text-white font-bold text-xs py-4 rounded-full shadow-warm hover:shadow-warm-lg transition-all flex items-center justify-center space-x-2"
                >
                  <ShoppingBag size={16} />
                  <span>
                    {addedFeedback
                      ? 'Added to Your Basket!'
                      : `Add to Basket • ₹${(product.price * quantity).toFixed(2)}`}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-lg text-stone-900">Craft Story & Details</h3>
            <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-line bg-parchment-50/50 p-4 rounded-2xl border border-parchment-200/70">
              {product.description}
            </p>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {product.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-parchment-100 text-stone-600 text-[11px] font-medium px-2.5 py-1 rounded-lg"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Value Props */}
          <div className="border-t border-parchment-200 pt-5 space-y-3">
            <div className="flex items-start space-x-3 text-xs text-stone-700">
              <Truck size={16} className="text-moss-600 shrink-0 mt-0.5" />
              <span>
                <strong>Free Shipping</strong> on Indian orders over ₹999. Carefully packaged.
              </span>
            </div>
            <div className="flex items-start space-x-3 text-xs text-stone-700">
              <Sparkles size={16} className="text-terracotta-600 shrink-0 mt-0.5" />
              <span>
                <strong>100% Authentic Handcraft:</strong> Wheel-thrown, handwoven, or hand-carved.
              </span>
            </div>
            <div className="flex items-start space-x-3 text-xs text-stone-700">
              <ShieldCheck size={16} className="text-moss-600 shrink-0 mt-0.5" />
              <span>
                <strong>Buyer Protection:</strong> Direct support and safe checkout via Stripe.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews & Ratings Section */}
      <section className="mt-20 pt-12 border-t border-parchment-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Reviews List */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Customer Reviews & Ratings
              </h3>
              <div className="flex items-center space-x-3 mt-2">
                <RatingStars rating={product.averageRating || 5} size={20} />
                <span className="text-sm font-bold text-stone-800">
                  {(product.averageRating || 5).toFixed(1)} out of 5
                </span>
                <span className="text-xs text-stone-500">
                  ({product.reviews?.length || 0} {product.reviews?.length === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            </div>

            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-4 pt-2">
                {product.reviews.map((rev) => (
                  <div
                    key={rev._id || rev.name}
                    className="bg-white rounded-2xl border border-parchment-200 p-5 shadow-xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-moss-100 text-moss-800 font-bold text-xs flex items-center justify-center shadow-xs">
                          {rev.name ? rev.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-bold text-stone-900">{rev.name}</span>
                            <span className="inline-flex items-center space-x-0.5 text-[10px] font-bold text-moss-700 bg-moss-50 border border-moss-200 px-1.5 py-0.2 rounded-full">
                              <BadgeCheck size={11} className="text-moss-600" />
                              <span>Verified Buyer</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] text-stone-400">
                        {rev.createdAt
                          ? new Date(rev.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'Recent'}
                      </span>
                    </div>

                    <RatingStars rating={rev.rating} size={14} />

                    <p className="text-xs text-stone-700 leading-relaxed pt-1">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-parchment-50 rounded-2xl border border-parchment-200 p-8 text-center space-y-2">
                <MessageSquare size={28} className="mx-auto text-stone-400" />
                <p className="text-sm font-bold text-stone-800">No reviews yet for this creation</p>
                <p className="text-xs text-stone-500">
                  Verified buyers who purchase this piece can leave the first review!
                </p>
              </div>
            )}
          </div>

          {/* Right: Leave a Review Form & Eligibility Box */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-parchment-200 p-6 sm:p-8 shadow-sm space-y-5 sticky top-28">
              <h4 className="font-serif font-bold text-xl text-stone-900 border-b border-parchment-100 pb-3">
                Write a Verified Review
              </h4>

              {reviewError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-2xl flex items-center space-x-2 shadow-xs">
                  <AlertCircle size={16} className="shrink-0 text-red-600" />
                  <span>{reviewError}</span>
                </div>
              )}

              {reviewSuccess && (
                <div className="bg-moss-50 border border-moss-200 text-moss-800 text-xs p-3.5 rounded-2xl flex items-center space-x-2 shadow-xs">
                  <Check size={16} className="shrink-0 text-moss-700" />
                  <span>{reviewSuccess}</span>
                </div>
              )}

              {!userInfo ? (
                /* 1. Unauthenticated state */
                <div className="text-center py-6 space-y-3 bg-parchment-50/60 rounded-2xl p-4 border border-parchment-200">
                  <p className="text-xs text-stone-600">
                    Please sign in with your buyer account to share a verified craft review.
                  </p>
                  <Link
                    to={`/login?redirect=/product/${id}`}
                    className="inline-block bg-moss-700 text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-moss-800 transition-colors shadow-xs"
                  >
                    Sign In to Review
                  </Link>
                </div>
              ) : eligibility.alreadyReviewed ? (
                /* 2. Already reviewed state */
                <div className="bg-moss-50/70 border border-moss-200 rounded-2xl p-5 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-moss-100 text-moss-700 flex items-center justify-center mx-auto">
                    <BadgeCheck size={22} />
                  </div>
                  <h5 className="font-serif font-bold text-sm text-stone-900">
                    Review Submitted
                  </h5>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    You have already reviewed this handcrafted piece. Thank you for supporting our artisan community!
                  </p>
                </div>
              ) : !eligibility.hasPurchased && !eligibility.loading ? (
                /* 3. Not purchased state */
                <div className="bg-parchment-50 border border-parchment-300 rounded-2xl p-5 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-parchment-200 text-stone-600 flex items-center justify-center mx-auto">
                    <ShieldCheck size={22} className="text-moss-700" />
                  </div>
                  <h5 className="font-serif font-bold text-sm text-stone-900">
                    Verified Buyer Review Only
                  </h5>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    To maintain authentic craft reviews, only buyers who have purchased this piece can submit a rating and review.
                  </p>
                  {product.stock > 0 && (
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="inline-flex items-center space-x-1.5 bg-moss-700 hover:bg-moss-800 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-xs transition-all"
                    >
                      <ShoppingBag size={14} />
                      <span>Order This Creation</span>
                    </button>
                  )}
                </div>
              ) : (
                /* 4. Eligible to review form */
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="bg-moss-50/60 border border-moss-200 rounded-xl p-3 flex items-center space-x-2 text-[11px] text-moss-800">
                    <BadgeCheck size={16} className="text-moss-600 shrink-0" />
                    <span>You are a verified purchaser of this handcrafted piece!</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                      Select Rating (1 to 5 Stars) *
                    </label>
                    <div className="flex items-center space-x-3">
                      <RatingStars
                        rating={rating}
                        interactive={true}
                        onRatingChange={(newVal) => setRating(newVal)}
                        size={24}
                      />
                      <span className="text-xs font-bold text-stone-700">
                        {RATING_LABELS[rating] || `${rating} Stars`}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                      Your Craft Review *
                    </label>
                    <textarea
                      rows="4"
                      placeholder="Share your thoughts on the craft quality, clay/textile finish, color fidelity, packaging, and handmade character..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full bg-parchment-50 border border-parchment-300 rounded-xl p-3 text-xs text-stone-800 focus:outline-none focus:border-moss-600 focus:bg-white"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="w-full bg-moss-700 hover:bg-moss-800 disabled:bg-moss-300 text-white font-bold text-xs py-3.5 rounded-full shadow-warm hover:shadow-warm-lg transition-all flex items-center justify-center space-x-2"
                  >
                    {reviewSubmitting ? (
                      <span>Publishing Verified Review...</span>
                    ) : (
                      <span>Submit Verified Review</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
