import React from 'react';
import { Link } from 'react-router-dom';
import { Store, MapPin, Sparkles } from 'lucide-react';

const featuredMakers = [
  {
    id: 'artisan-1',
    name: 'Rajesh Kumawat',
    shopName: 'Jaipur Heritage Pottery & Clay',
    location: 'Jaipur, Rajasthan',
    specialty: 'Wheel-thrown & Blue Pottery',
    avatar: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=300&q=80',
    banner: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
    bio: 'Preserving generations of traditional wheel-thrown terracotta, hand-painted glaze work, and authentic Jaipur blue pottery.',
    filter: 'Pottery & Ceramics',
  },
  {
    id: 'artisan-2',
    name: 'Meera Patel',
    shopName: 'Kutch Handlooms & Botanicals',
    location: 'Bhuj, Gujarat',
    specialty: 'Kala Cotton & Soy Candles',
    avatar: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=300&q=80',
    banner: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80',
    bio: 'Hand-weaving organic Kala cotton textiles on pit looms and hand-pouring sandalwood and mogra soy wax aromatherapy candles.',
    filter: 'Handwoven Textiles',
  },
  {
    id: 'artisan-3',
    name: 'Deepak Mohanty',
    shopName: 'Konark Woodcraft & Filigree',
    location: 'Puri, Odisha',
    specialty: 'Sheesham Wood & Silver Filigree',
    avatar: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=300&q=80',
    banner: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80',
    bio: 'Hand-carving seasoned Sheesham wood spice boxes and forging traditional Tarakasi 92.5 silver wire filigree rings and earrings.',
    filter: 'Handcrafted Jewelry',
  },
];

const FeaturedArtisans = () => {
  return (
    <section className="py-16 bg-parchment-100 border-y border-parchment-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-1.5 text-xs uppercase font-bold tracking-widest text-terracotta-600 mb-2">
            <Sparkles size={14} />
            <span>Maker Spotlight</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Meet the Independent Creators
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Every item has a maker, a studio, and a story. Support real artisans keeping timeless craft traditions alive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredMakers.map((maker) => (
            <div
              key={maker.id}
              className="bg-white rounded-2xl border border-parchment-200 overflow-hidden shadow-sm hover:shadow-warm transition-all duration-300 flex flex-col justify-between"
            >
              {/* Studio Banner */}
              <div className="h-32 w-full relative overflow-hidden bg-stone-200">
                <img
                  src={maker.banner}
                  alt={maker.shopName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>

              {/* Avatar & Info */}
              <div className="px-6 pb-6 pt-0 relative flex-1 flex flex-col justify-between">
                <div className="relative -mt-10 mb-3 flex items-end justify-between">
                  <div className="w-16 h-16 rounded-2xl border-2 border-white shadow-md overflow-hidden bg-white">
                    <img
                      src={maker.avatar}
                      alt={maker.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-moss-700 bg-moss-50 border border-moss-200 px-2.5 py-1 rounded-full">
                    {maker.specialty}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-lg text-stone-900">
                    {maker.shopName}
                  </h3>
                  <div className="flex items-center space-x-1.5 text-xs text-stone-500 font-medium">
                    <MapPin size={13} className="text-terracotta-500" />
                    <span>{maker.location}</span>
                    <span>•</span>
                    <span>Maker: {maker.name}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3 pt-1">
                    {maker.bio}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-parchment-100">
                  <Link
                    to={`/products?category=${encodeURIComponent(maker.filter)}`}
                    className="w-full inline-flex items-center justify-center space-x-2 bg-parchment-50 hover:bg-moss-700 hover:text-white text-stone-800 text-xs font-semibold py-2.5 rounded-xl border border-parchment-300 hover:border-moss-700 transition-all"
                  >
                    <Store size={14} />
                    <span>Explore Studio Goods</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedArtisans;
