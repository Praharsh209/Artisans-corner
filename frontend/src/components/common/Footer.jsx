import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Truck, Sparkles, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-moss-900 text-parchment-100 mt-20 pt-16 pb-12 border-t-4 border-terracotta-500">
      {/* Top Value Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-moss-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-center space-x-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-moss-800 text-terracotta-400 flex items-center justify-center shrink-0">
              <Heart size={24} />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Handcrafted & Unique</h4>
              <p className="text-xs text-parchment-300 mt-0.5">Every piece crafted with individual care.</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-moss-800 text-terracotta-400 flex items-center justify-center shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Direct Artisan Shipping</h4>
              <p className="text-xs text-parchment-300 mt-0.5">Dispatched directly from local workshops.</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-moss-800 text-terracotta-400 flex items-center justify-center shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Secure Stripe Payments</h4>
              <p className="text-xs text-parchment-300 mt-0.5">Encrypted transactions & buyer protection.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Story */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🌿</span>
              <span className="font-serif text-2xl font-bold text-white">Artisan's Corner</span>
            </div>
            <p className="text-sm text-parchment-300 leading-relaxed pr-6">
              A curated community connecting independent makers, potters, weavers, and woodworkers with mindful shoppers who cherish authentic craftsmanship and timeless design.
            </p>
            <div className="pt-2 flex items-center space-x-3 text-xs text-terracotta-300">
              <Sparkles size={16} />
              <span>Proudly empowering 500+ independent studios</span>
            </div>
          </div>

          {/* Shop Categories */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-base">Handmade Goods</h4>
            <ul className="space-y-2 text-sm text-parchment-300">
              <li>
                <Link to="/products?category=Pottery%20%26%20Ceramics" className="hover:text-terracotta-400 transition-colors">
                  Pottery & Ceramics
                </Link>
              </li>
              <li>
                <Link to="/products?category=Handwoven%20Textiles" className="hover:text-terracotta-400 transition-colors">
                  Handwoven Textiles
                </Link>
              </li>
              <li>
                <Link to="/products?category=Handcrafted%20Jewelry" className="hover:text-terracotta-400 transition-colors">
                  Handcrafted Jewelry
                </Link>
              </li>
              <li>
                <Link to="/products?category=Woodcraft%20%26%20Utensils" className="hover:text-terracotta-400 transition-colors">
                  Woodcraft & Utensils
                </Link>
              </li>
              <li>
                <Link to="/products?category=Candles%20%26%20Botanicals" className="hover:text-terracotta-400 transition-colors">
                  Candles & Botanicals
                </Link>
              </li>
              <li>
                <Link to="/products?category=Leather%20Goods" className="hover:text-terracotta-400 transition-colors">
                  Leather Goods
                </Link>
              </li>
            </ul>
          </div>

          {/* Artisans / Sell */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-base">For Makers</h4>
            <ul className="space-y-2 text-sm text-parchment-300">
              <li>
                <Link to="/register" className="hover:text-terracotta-400 transition-colors">
                  Open an Artisan Shop
                </Link>
              </li>
              <li>
                <Link to="/vendor/dashboard" className="hover:text-terracotta-400 transition-colors">
                  Seller Dashboard
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-terracotta-400 transition-colors">
                  Marketplace Standards
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-terracotta-400 transition-colors">
                  Seller Payouts (95%)
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-base">Studio Dispatch</h4>
            <p className="text-xs text-parchment-300">
              Receive stories from the workshop, maker spotlights, and early access to small-batch drops.
            </p>
            <div className="flex items-center space-x-1.5 pt-1">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-moss-800 border border-moss-700 rounded-lg px-3 py-2 text-xs text-white placeholder-parchment-400 focus:outline-none focus:border-terracotta-400"
              />
              <button
                type="button"
                className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors shrink-0"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-moss-800 text-center text-xs text-parchment-400 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
        <p>© {new Date().getFullYear()} Artisan's Corner Inc. All handcrafted rights reserved.</p>
        <p className="flex items-center space-x-1">
          <span>Crafted with patience, clay, and code.</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
