import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const defaultCategories = [
  {
    name: 'Pottery & Ceramics',
    slug: 'pottery-ceramics',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80',
    itemCount: 'Terracotta & Blue Pottery',
  },
  {
    name: 'Handwoven Textiles',
    slug: 'handwoven-textiles',
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80',
    itemCount: 'Pashmina & Kala Cotton',
  },
  {
    name: 'Handcrafted Jewelry',
    slug: 'handcrafted-jewelry',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    itemCount: '92.5 Silver & Filigree',
  },
  {
    name: 'Woodcraft & Utensils',
    slug: 'woodcraft-utensils',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    itemCount: 'Sheesham & Brass Inlay',
  },
  {
    name: 'Candles & Botanicals',
    slug: 'candles-botanicals',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80',
    itemCount: 'Sandalwood & Mogra Soy',
  },
  {
    name: 'Leather Goods',
    slug: 'leather-goods',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
    itemCount: 'Vegetable-Tanned Leather',
  },
];

const CategoryGrid = ({ categories = defaultCategories }) => {
  const displayList = categories.length > 0 ? categories : defaultCategories;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-terracotta-600">
              Curated Mediums
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
              Shop by Craft & Discipline
            </h2>
          </div>
          <Link
            to="/products"
            className="mt-4 md:mt-0 inline-flex items-center space-x-1 text-sm font-bold text-moss-700 hover:text-moss-900 group"
          >
            <span>View All Categories</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {displayList.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group relative rounded-2xl overflow-hidden bg-parchment-100 border border-parchment-200 aspect-[3/4] flex flex-col justify-end p-4 shadow-sm hover:shadow-warm hover:-translate-y-1 transition-all duration-300"
            >
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80'}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

              <div className="relative z-10 text-white">
                <h3 className="font-serif font-bold text-sm sm:text-base leading-snug">
                  {cat.name}
                </h3>
                {cat.itemCount && (
                  <p className="text-[11px] text-parchment-200 font-sans mt-0.5 opacity-90 line-clamp-1">
                    {cat.itemCount}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
