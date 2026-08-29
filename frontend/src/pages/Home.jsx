import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import HeroSection from '../components/home/HeroSection';
import CategoryGrid from '../components/home/CategoryGrid';
import FeaturedArtisans from '../components/home/FeaturedArtisans';
import ValueProps from '../components/home/ValueProps';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ArrowRight, Sparkles } from 'lucide-react';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products/featured'),
          api.get('/categories'),
        ]);
        setFeaturedProducts(productsRes.data || []);
        setCategories(categoriesRes.data || []);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-0">
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Categories */}
      <CategoryGrid categories={categories} />

      {/* 3. Featured Handmade Works */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs uppercase font-bold tracking-widest text-terracotta-600 mb-1">
              <Sparkles size={14} />
              <span>Small-Batch Pieces</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Featured Handcrafted Works
            </h2>
          </div>
          <Link
            to="/products"
            className="mt-4 md:mt-0 inline-flex items-center space-x-1.5 text-sm font-bold text-moss-700 hover:text-moss-900 group"
          >
            <span>Explore All Creations</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Curating handcrafted catalog..." />
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-parchment-200 p-8">
            <p className="text-stone-600 font-serif text-lg">No featured products found.</p>
            <p className="text-xs text-stone-400 mt-1">Make sure database is seeded.</p>
          </div>
        )}
      </section>

      {/* 4. Maker Spotlight */}
      <FeaturedArtisans />

      {/* 5. Value Props & Seller Callout */}
      <ValueProps />
    </div>
  );
};

export default Home;
