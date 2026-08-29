import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Filter, X, SlidersHorizontal, ChevronLeft, ChevronRight, Search } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filter states
  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'newest';
  const pageNumber = searchParams.get('page') || '1';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const inStock = searchParams.get('inStock') === 'true';

  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data || []);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products whenever search params change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (keyword) params.set('keyword', keyword);
        if (category && category !== 'all') params.set('category', category);
        if (sort) params.set('sort', sort);
        if (pageNumber) params.set('pageNumber', pageNumber);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (inStock) params.set('inStock', 'true');

        const { data } = await api.get(`/products?${params.toString()}`);
        setProducts(data.products || []);
        setTotalPages(data.pages || 1);
        setTotalProducts(data.totalProducts || 0);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, category, sort, pageNumber, minPrice, maxPrice, inStock]);

  const updateFilters = (newParams) => {
    const next = new URLSearchParams(searchParams);
    Object.keys(newParams).forEach((key) => {
      if (newParams[key] === null || newParams[key] === '' || newParams[key] === 'all') {
        next.delete(key);
      } else {
        next.set(key, newParams[key]);
      }
    });
    // Reset to page 1 on filter changes if page wasn't explicitly set
    if (!newParams.page) {
      next.delete('page');
    }
    setSearchParams(next);
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    updateFilters({ minPrice: localMin, maxPrice: localMax });
  };

  const handleClearFilters = () => {
    setLocalMin('');
    setLocalMax('');
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(
    keyword || (category && category !== 'all') || minPrice || maxPrice || inStock || sort !== 'newest'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="border-b border-parchment-200 pb-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              {category !== 'all' ? category : 'Handmade Marketplace'}
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              {keyword ? `Search results for "${keyword}" • ` : ''}
              Showing {totalProducts} handcrafted pieces
            </p>
          </div>

          {/* Sort & Mobile Filter Toggle */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center space-x-2 bg-white border border-parchment-300 text-stone-800 text-xs font-semibold px-4 py-2 rounded-xl shadow-xs"
            >
              <Filter size={15} />
              <span>Filters</span>
            </button>

            {/* Sort Select */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-stone-500 font-medium hidden sm:inline">Sort:</span>
              <select
                value={sort}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="bg-white border border-parchment-300 rounded-xl text-xs font-medium text-stone-800 py-2 pl-3 pr-8 focus:outline-none focus:border-moss-600 shadow-xs"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-parchment-100">
            <span className="text-xs text-stone-400 font-medium">Active filters:</span>
            {keyword && (
              <span className="inline-flex items-center space-x-1 bg-moss-50 border border-moss-200 text-moss-800 text-xs px-2.5 py-1 rounded-full">
                <span>Keyword: "{keyword}"</span>
                <button type="button" onClick={() => updateFilters({ keyword: null })}>
                  <X size={13} />
                </button>
              </span>
            )}
            {category && category !== 'all' && (
              <span className="inline-flex items-center space-x-1 bg-moss-50 border border-moss-200 text-moss-800 text-xs px-2.5 py-1 rounded-full">
                <span>Category: {category}</span>
                <button type="button" onClick={() => updateFilters({ category: null })}>
                  <X size={13} />
                </button>
              </span>
            )}
            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center space-x-1 bg-moss-50 border border-moss-200 text-moss-800 text-xs px-2.5 py-1 rounded-full">
                <span>Price: ₹{minPrice || '0'} - ₹{maxPrice || '∞'}</span>
                <button
                  type="button"
                  onClick={() => {
                    setLocalMin('');
                    setLocalMax('');
                    updateFilters({ minPrice: null, maxPrice: null });
                  }}
                >
                  <X size={13} />
                </button>
              </span>
            )}
            {inStock && (
              <span className="inline-flex items-center space-x-1 bg-moss-50 border border-moss-200 text-moss-800 text-xs px-2.5 py-1 rounded-full">
                <span>In Stock Only</span>
                <button type="button" onClick={() => updateFilters({ inStock: null })}>
                  <X size={13} />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs text-terracotta-600 hover:text-terracotta-700 font-semibold underline ml-2"
            >
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filter */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white rounded-2xl border border-parchment-200 p-6 shadow-sm space-y-6">
            {/* Categories */}
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-base mb-3">Categories</h3>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => updateFilters({ category: 'all' })}
                  className={`w-full text-left text-xs py-1.5 px-3 rounded-lg font-medium transition-colors ${
                    category === 'all'
                      ? 'bg-moss-700 text-white font-bold'
                      : 'text-stone-700 hover:bg-parchment-100'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id || cat.name}
                    type="button"
                    onClick={() => updateFilters({ category: cat.name })}
                    className={`w-full text-left text-xs py-1.5 px-3 rounded-lg font-medium transition-colors ${
                      category === cat.name
                        ? 'bg-moss-700 text-white font-bold'
                        : 'text-stone-700 hover:bg-parchment-100'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="pt-4 border-t border-parchment-100">
              <h3 className="font-serif font-bold text-stone-900 text-base mb-3">Price Range (₹)</h3>
              <form onSubmit={handlePriceApply} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="Min"
                    value={localMin}
                    onChange={(e) => setLocalMin(e.target.value)}
                    className="w-full bg-parchment-50 border border-parchment-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-moss-600"
                  />
                  <span className="text-stone-400 text-xs">-</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Max"
                    value={localMax}
                    onChange={(e) => setLocalMax(e.target.value)}
                    className="w-full bg-parchment-50 border border-parchment-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-moss-600"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-parchment-100 hover:bg-moss-700 hover:text-white text-stone-800 text-xs font-semibold py-1.5 rounded-lg border border-parchment-300 transition-colors"
                >
                  Apply Price
                </button>
              </form>
            </div>

            {/* Stock Filter */}
            <div className="pt-4 border-t border-parchment-100">
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => updateFilters({ inStock: e.target.checked ? 'true' : null })}
                  className="rounded border-parchment-300 text-moss-700 focus:ring-moss-600 h-4 w-4"
                />
                <span className="text-xs font-medium text-stone-800">In Stock Ready to Ship</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3">
          {loading ? (
            <LoadingSpinner message="Searching artisan workshops..." />
          ) : products.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center space-x-2">
                  <button
                    type="button"
                    disabled={Number(pageNumber) <= 1}
                    onClick={() => updateFilters({ page: String(Number(pageNumber) - 1) })}
                    className="p-2 rounded-lg border border-parchment-300 bg-white text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-parchment-100 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      type="button"
                      onClick={() => updateFilters({ page: String(i + 1) })}
                      className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                        Number(pageNumber) === i + 1
                          ? 'bg-moss-700 text-white shadow-xs'
                          : 'bg-white border border-parchment-300 text-stone-800 hover:bg-parchment-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={Number(pageNumber) >= totalPages}
                    onClick={() => updateFilters({ page: String(Number(pageNumber) + 1) })}
                    className="p-2 rounded-lg border border-parchment-300 bg-white text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-parchment-100 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-parchment-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-parchment-100 text-stone-400 flex items-center justify-center mx-auto text-2xl">
                🔍
              </div>
              <h3 className="font-serif font-bold text-xl text-stone-800">No Handcrafted Items Found</h3>
              <p className="text-sm text-stone-500 max-w-md mx-auto">
                We couldn't find any products matching your selected filters. Try broadening your keywords or resetting your filter criteria.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center space-x-1.5 bg-moss-700 text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-moss-800 transition-colors shadow-sm"
              >
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          ></div>
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 shadow-2xl overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-parchment-200 pb-4">
              <h2 className="font-serif font-bold text-lg text-stone-900">Filter Products</h2>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-stone-500 hover:text-stone-900"
              >
                <X size={20} />
              </button>
            </div>

            {/* Category list */}
            <div>
              <h4 className="font-serif font-bold text-sm text-stone-900 mb-2">Category</h4>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    updateFilters({ category: 'all' });
                    setMobileFilterOpen(false);
                  }}
                  className={`w-full text-left text-xs py-2 px-3 rounded-lg ${
                    category === 'all' ? 'bg-moss-700 text-white font-bold' : 'text-stone-700'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id || cat.name}
                    type="button"
                    onClick={() => {
                      updateFilters({ category: cat.name });
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left text-xs py-2 px-3 rounded-lg ${
                      category === cat.name ? 'bg-moss-700 text-white font-bold' : 'text-stone-700'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price apply */}
            <div className="pt-4 border-t border-parchment-200">
              <h4 className="font-serif font-bold text-sm text-stone-900 mb-2">Price Range</h4>
              <form
                onSubmit={(e) => {
                  handlePriceApply(e);
                  setMobileFilterOpen(false);
                }}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={localMin}
                    onChange={(e) => setLocalMin(e.target.value)}
                    className="w-full bg-parchment-50 border border-parchment-300 rounded-lg p-2 text-xs"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={localMax}
                    onChange={(e) => setLocalMax(e.target.value)}
                    className="w-full bg-parchment-50 border border-parchment-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-moss-700 text-white text-xs font-bold py-2 rounded-lg"
                >
                  Apply
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
