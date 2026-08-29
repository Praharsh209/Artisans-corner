import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Leaf } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-parchment-100 border-b border-parchment-300">
      {/* Background Subtle Accent */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-moss-200/40 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-terracotta-200/40 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-moss-50 border border-moss-200 text-moss-800 text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-xs">
              <Sparkles size={14} className="text-terracotta-500" />
              <span>Independent Craft Marketplace</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 tracking-tight leading-[1.15]">
              Crafted by human hands,{' '}
              <span className="text-moss-700 italic">cherished</span> for generations.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Step away from mass production. Discover one-of-a-kind ceramics, handwoven textiles, heirloom woodcraft, and artisan jewelry sold directly by the makers themselves.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <Link
                to="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-moss-700 hover:bg-moss-800 text-white font-semibold px-7 py-3.5 rounded-full shadow-warm hover:shadow-warm-lg transition-all text-sm group"
              >
                <span>Explore Handmade Goods</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-parchment-50 border border-parchment-300 text-stone-800 font-semibold px-6 py-3.5 rounded-full shadow-xs hover:shadow transition-all text-sm"
              >
                <span>Open an Artisan Shop</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-parchment-200/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center space-x-2">
                <Leaf size={18} className="text-moss-600 shrink-0" />
                <span className="text-xs font-semibold text-stone-700">100% Handcrafted</span>
              </div>
              <div className="flex items-center space-x-2">
                <HeartHandshake size={18} className="text-terracotta-600 shrink-0" />
                <span className="text-xs font-semibold text-stone-700">95% Maker Payout</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck size={18} className="text-moss-600 shrink-0" />
                <span className="text-xs font-semibold text-stone-700">Verified Studios</span>
              </div>
            </div>
          </div>

          {/* Hero Collage */}
          <div className="lg:col-span-5 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-warm border-2 border-white aspect-[4/5] relative group">
                  <img
                    src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80"
                    alt="Artisan ceramicist at wheel"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 text-white">
                    <p className="text-xs font-semibold">Jaipur Pottery</p>
                    <p className="text-[10px] text-parchment-200">Heritage Clayware</p>
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden shadow-warm border-2 border-white aspect-square relative group">
                  <img
                    src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"
                    alt="Handmade jewelry"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden shadow-warm border-2 border-white aspect-square relative group">
                  <img
                    src="https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80"
                    alt="Handwoven textile throw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="rounded-2xl overflow-hidden shadow-warm border-2 border-white aspect-[4/5] relative group">
                  <img
                    src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80"
                    alt="Hand-carved woodcraft utensils"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 text-white">
                    <p className="text-xs font-semibold">Konark Woodcraft</p>
                    <p className="text-[10px] text-parchment-200">Carved Sheesham</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Decorative Stamp */}
            <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-sm border border-parchment-300 px-4 py-2.5 rounded-xl shadow-warm flex items-center space-x-2.5">
              <span className="text-2xl">🏺</span>
              <div>
                <p className="text-xs font-bold text-stone-900">100% Ethical</p>
                <p className="text-[10px] text-stone-500">Every sale supports makers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
