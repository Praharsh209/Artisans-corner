import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import RatingStars from './RatingStars';
import { ShoppingBag, Check, Store } from 'lucide-react';

const ProductCard = ({ product }) => {
  const [added, setAdded] = useState(false);
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        stock: product.stock,
        vendor: product.vendor?._id || product.vendor,
        quantity: 1,
      })
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const vendorShopName =
    product.vendor?.shopProfile?.shopName ||
    product.vendor?.name ||
    'Independent Artisan';

  return (
    <div className="group bg-white rounded-2xl border border-parchment-200 overflow-hidden shadow-sm hover:shadow-warm transition-all duration-300 flex flex-col h-full">
      {/* Product Image */}
      <Link
        to={`/product/${product._id}`}
        className="relative aspect-square overflow-hidden bg-parchment-100 block"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category Pill */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-moss-800 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-xs">
          {product.category}
        </span>

        {/* Stock Alert Badge */}
        {product.stock <= 3 && product.stock > 0 && (
          <span className="absolute top-3 right-3 bg-terracotta-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-white text-stone-900 font-bold text-xs uppercase tracking-wider px-3 py-1.5 rounded-md">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Artisan Maker Name */}
          <div className="flex items-center space-x-1.5 text-xs text-stone-500 font-medium">
            <Store size={12} className="text-terracotta-500" />
            <span className="truncate">{vendorShopName}</span>
          </div>

          {/* Product Title */}
          <Link
            to={`/product/${product._id}`}
            className="font-serif font-bold text-stone-900 text-base group-hover:text-moss-800 transition-colors line-clamp-2"
          >
            {product.name}
          </Link>

          {/* Reviews & Ratings */}
          <div className="pt-0.5">
            <RatingStars
              rating={product.averageRating || 5}
              numReviews={product.numReviews || 0}
              size={13}
            />
          </div>
        </div>

        {/* Price and Cart Action */}
        <div className="pt-3 border-t border-parchment-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400 font-medium block">Price</span>
            <span className="font-serif font-bold text-lg text-moss-900">
              ₹{Number(product.price).toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
            className={`p-2.5 rounded-xl text-sm font-semibold flex items-center justify-center transition-all ${
              product.stock === 0
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : added
                ? 'bg-moss-700 text-white'
                : 'bg-parchment-100 text-stone-800 hover:bg-moss-700 hover:text-white'
            }`}
            title="Add to cart"
            aria-label="Add to cart"
          >
            {added ? (
              <span className="flex items-center space-x-1 text-xs px-1">
                <Check size={16} />
                <span>Added</span>
              </span>
            ) : (
              <ShoppingBag size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
