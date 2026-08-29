import React from 'react';
import { Link } from 'react-router-dom';
import { Store, DollarSign, Sparkles, Truck, CheckCircle2 } from 'lucide-react';

const ValueProps = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner CTA Box */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-moss-800 to-moss-900 text-white p-8 sm:p-12 lg:p-16 shadow-warm-lg">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 rounded-full bg-moss-700/50 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-moss-700 text-parchment-200 text-xs font-semibold px-3.5 py-1.5 rounded-full">
                <Store size={14} className="text-terracotta-400" />
                <span>Join Our Maker Guild</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Are you a maker, ceramicist, or woodworker?
              </h2>

              <p className="text-base text-parchment-200 leading-relaxed max-w-2xl">
                Open your digital workshop storefront in minutes. Keep 95% of every sale, access a global community of mindful craft lovers, and manage your inventory with zero fuss.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center space-x-2 text-sm text-parchment-100">
                  <CheckCircle2 size={18} className="text-terracotta-400 shrink-0" />
                  <span>95% Direct Payout</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-parchment-100">
                  <CheckCircle2 size={18} className="text-terracotta-400 shrink-0" />
                  <span>No Listing Fees</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-parchment-100">
                  <CheckCircle2 size={18} className="text-terracotta-400 shrink-0" />
                  <span>Stripe Instant Processing</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3 lg:space-x-0 lg:space-y-3">
              <Link
                to="/register"
                className="w-full text-center bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all text-sm"
              >
                Become an Artisan Seller
              </Link>
              <Link
                to="/products"
                className="w-full text-center bg-moss-700/80 hover:bg-moss-700 text-parchment-100 font-semibold px-8 py-4 rounded-full border border-moss-600 transition-all text-sm"
              >
                Browse Marketplace
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProps;
