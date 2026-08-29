const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env
dotenv.config();

// Models
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/artisans_corner'
    );
    console.log(`MongoDB Connected for seeding: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log('Cleared existing collections...');

    // 1. Create Users
    const buyerHash = await bcrypt.hash('buyer123', 10);
    const vendorHash = await bcrypt.hash('vendor123', 10);

    const users = await User.insertMany([
      {
        name: 'Ananya Sharma',
        email: 'buyer@artisans.com',
        password: buyerHash,
        role: 'buyer',
        address: {
          street: '42 Indiranagar, 12th Main',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560038',
          country: 'India',
        },
      },
      {
        name: 'Rajesh Kumawat',
        email: 'vendor@artisans.com',
        password: vendorHash,
        role: 'vendor',
        address: {
          street: '15 Sanganer Road',
          city: 'Jaipur',
          state: 'Rajasthan',
          postalCode: '302029',
          country: 'India',
        },
        shopProfile: {
          shopName: 'Jaipur Heritage Pottery & Clay',
          logo: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=400&q=80',
          description:
            'Generations of traditional wheel-thrown terracotta, glazed tableware, and authentic Jaipur blue pottery.',
          banner: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
        },
      },
      {
        name: 'Meera Patel',
        email: 'artisan2@artisans.com',
        password: vendorHash,
        role: 'vendor',
        address: {
          street: '8 Bhuj Crafts Lane',
          city: 'Bhuj',
          state: 'Gujarat',
          postalCode: '370001',
          country: 'India',
        },
        shopProfile: {
          shopName: 'Kutch Handlooms & Botanicals',
          logo: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
          description:
            'Organic Kala cotton handweaves, hand-block prints, and Ayurvedic pure soy & beeswax candles.',
          banner: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80',
        },
      },
      {
        name: 'Deepak Mohanty',
        email: 'artisan3@artisans.com',
        password: vendorHash,
        role: 'both',
        address: {
          street: '24 Temple Crafts Street',
          city: 'Puri',
          state: 'Odisha',
          postalCode: '752001',
          country: 'India',
        },
        shopProfile: {
          shopName: 'Konark Woodcraft & Filigree',
          logo: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80',
          description:
            'Hand-carved Sheesham wood tableware and delicate 92.5 sterling silver Tarakasi filigree jewelry.',
          banner: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=1200&q=80',
        },
      },
    ]);

    const buyer = users[0];
    const vendor1 = users[1]; // Jaipur Heritage Pottery
    const vendor2 = users[2]; // Kutch Handlooms
    const vendor3 = users[3]; // Konark Woodcraft

    console.log('Seeded Users.');

    // 2. Create Categories
    const categories = await Category.insertMany([
      {
        name: 'Pottery & Ceramics',
        slug: 'pottery-ceramics',
        description: 'Wheel-thrown stoneware mugs, glazed handis, and terracotta vases.',
        image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Handwoven Textiles',
        slug: 'handwoven-textiles',
        description: 'Pure Pashmina throws, Kala cotton blankets, and linen table runners.',
        image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Handcrafted Jewelry',
        slug: 'handcrafted-jewelry',
        description: '92.5 silver rings, filigree jhumkas, and raw natural gemstone pendants.',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Woodcraft & Utensils',
        slug: 'woodcraft-utensils',
        description: 'Hand-carved Sheesham spice boxes, teakwood platters, and spoons.',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Candles & Botanicals',
        slug: 'candles-botanicals',
        description: 'Hand-poured soy wax candles with Mysore sandalwood, jasmine, and saffron.',
        image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Leather Goods',
        slug: 'leather-goods',
        description: 'Hand-stitched vegetable-tanned leather journals, wallets, and accessories.',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
      },
    ]);

    console.log('Seeded Categories.');

    // 3. Create Products
    const products = await Product.insertMany([
      {
        vendor: vendor1._id,
        name: 'Speckled Moss Ceramic Coffee Mug',
        description:
          'Hand-thrown stoneware coffee mug glazed in rich moss green with natural iron speckles. Comfortable ergonomic handle for daily chai, coffee, and herbal teas. Microwave and dishwasher safe.',
        category: 'Pottery & Ceramics',
        images: [
          'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=800&q=80',
        ],
        price: 650.0,
        stock: 15,
        tags: ['mug', 'stoneware', 'moss green', 'chai', 'handmade'],
        reviews: [
          {
            user: buyer._id,
            name: 'Ananya Sharma',
            rating: 5,
            comment:
              'The weight and glaze texture are wonderful. Truly authentic handcrafted ceramic quality!',
            createdAt: new Date('2026-02-10'),
          },
        ],
        averageRating: 5.0,
        numReviews: 1,
      },
      {
        vendor: vendor1._id,
        name: 'Hand-Painted Terracotta Fluted Vase',
        description:
          'Sculptural earthenware vase crafted by master potters. Features subtle vertical ribbing with a natural terracotta exterior and watertight interior for fresh marigolds or dried botanicals.',
        category: 'Pottery & Ceramics',
        images: [
          'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
        ],
        price: 1450.0,
        stock: 8,
        tags: ['vase', 'terracotta', 'decor', 'centerpiece'],
        reviews: [],
        averageRating: 4.8,
        numReviews: 4,
      },
      {
        vendor: vendor1._id,
        name: 'Artisan Clay Pasta & Curry Bowls (Set of 2)',
        description:
          'Wide rimmed stoneware bowls finished with an earthy reactive oatmeal glaze. Perfect for warm curries, biryani, or pastas. Oven and microwave safe.',
        category: 'Pottery & Ceramics',
        images: [
          'https://images.unsplash.com/photo-1576020799627-aeac74d58064?auto=format&fit=crop&w=800&q=80',
        ],
        price: 1850.0,
        stock: 6,
        tags: ['dinnerware', 'bowls', 'curry', 'kitchen'],
        reviews: [],
        averageRating: 5.0,
        numReviews: 2,
      },
      {
        vendor: vendor3._id,
        name: 'Hand-Carved Sheesham Wood Spice Box (Masala Dabba)',
        description:
          'Traditional wooden spice chest hand-carved from seasoned Indian Sheesham wood with brass floral inlay work. Includes 7 removable compartments and a carved spoon.',
        category: 'Woodcraft & Utensils',
        images: [
          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        ],
        price: 1450.0,
        stock: 12,
        tags: ['woodcraft', 'sheesham', 'spice box', 'kitchen'],
        reviews: [
          {
            user: buyer._id,
            name: 'Ananya Sharma',
            rating: 5,
            comment:
              'The brass inlay work on the Sheesham wood is spectacular. Sturdy and fragrant wood.',
            createdAt: new Date('2026-02-14'),
          },
        ],
        averageRating: 5.0,
        numReviews: 1,
      },
      {
        vendor: vendor3._id,
        name: 'Reclaimed Teakwood Artisan Cooking Spoon Set',
        description:
          'Set of 3 smooth cooking and serving ladles hand-carved from aged teakwood. Finished with natural beeswax and cold-pressed coconut oil.',
        category: 'Woodcraft & Utensils',
        images: [
          'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80',
        ],
        price: 699.0,
        stock: 20,
        tags: ['spoons', 'teakwood', 'kitchen', 'cooking'],
        reviews: [],
        averageRating: 4.9,
        numReviews: 7,
      },
      {
        vendor: vendor2._id,
        name: 'Mysore Sandalwood & Mogra Soy Wax Candle',
        description:
          'Hand-poured 100% natural soy wax candle in an amber glass vessel with a wooden crackle wick. Infused with pure Mysore sandalwood essential oil and night-blooming jasmine.',
        category: 'Candles & Botanicals',
        images: [
          'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
        ],
        price: 549.0,
        stock: 25,
        tags: ['candle', 'soy wax', 'sandalwood', 'aromatherapy'],
        reviews: [],
        averageRating: 4.7,
        numReviews: 3,
      },
      {
        vendor: vendor2._id,
        name: 'Handwoven Pashmina Cashmere Throw Blanket',
        description:
          'Luxuriously soft throw handwoven on traditional wooden looms using authentic fine mountain cashmere. Warm, breathable, and finished with delicate fringe tassels.',
        category: 'Handwoven Textiles',
        images: [
          'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
        ],
        price: 4200.0,
        stock: 5,
        tags: ['pashmina', 'cashmere', 'throw', 'handwoven', 'cozy'],
        reviews: [],
        averageRating: 5.0,
        numReviews: 6,
      },
      {
        vendor: vendor3._id,
        name: 'Filigree 92.5 Sterling Silver Turquoise Ring',
        description:
          'Handcrafted pure 92.5 sterling silver band featuring traditional wire filigree (Tarakasi) work and a bezel-set natural turquoise stone.',
        category: 'Handcrafted Jewelry',
        images: [
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
        ],
        price: 1850.0,
        stock: 9,
        tags: ['jewelry', 'silver', 'filigree', 'ring', 'gemstone'],
        reviews: [],
        averageRating: 4.8,
        numReviews: 5,
      },
      {
        vendor: vendor3._id,
        name: 'Hammered Silver Drop Earrings',
        description:
          'Lightweight geometric drop earrings crafted from recycled sterling silver, hand-hammered to catch and reflect warm ambient light.',
        category: 'Handcrafted Jewelry',
        images: [
          'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80',
        ],
        price: 1200.0,
        stock: 14,
        tags: ['earrings', 'silver', 'minimalist', 'jewelry'],
        reviews: [],
        averageRating: 5.0,
        numReviews: 4,
      },
      {
        vendor: vendor2._id,
        name: 'Hand-stitched Vegetable Tanned Leather Diary',
        description:
          'Refillable handcrafted leather notebook cover made from full-grain vegetable-tanned leather. Includes 160 pages of handmade deckle-edge recycled cotton paper.',
        category: 'Leather Goods',
        images: [
          'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        ],
        price: 899.0,
        stock: 12,
        tags: ['leather', 'journal', 'stationery', 'handstitched'],
        reviews: [],
        averageRating: 4.9,
        numReviews: 8,
      },
    ]);

    console.log('Seeded Products.');

    // 4. Create Initial Sample Order
    const p1 = products[0]; // Speckled Mug (₹650)
    const p2 = products[5]; // Sandalwood Candle (₹549)
    const itemsPrice = p1.price * 1 + p2.price * 1; // ₹1199
    const shippingPrice = itemsPrice > 999 ? 0 : 99; // 0
    const taxPrice = Math.round(itemsPrice * 0.05 * 100) / 100;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    await Order.create({
      buyer: buyer._id,
      orderItems: [
        {
          product: p1._id,
          name: p1.name,
          image: p1.images[0],
          price: p1.price,
          quantity: 1,
          vendor: vendor1._id,
          itemStatus: 'Delivered',
          platformFee: Math.round(p1.price * 0.05 * 100) / 100,
          vendorPayout: Math.round(p1.price * 0.95 * 100) / 100,
        },
        {
          product: p2._id,
          name: p2.name,
          image: p2.images[0],
          price: p2.price,
          quantity: 1,
          vendor: vendor2._id,
          itemStatus: 'Delivered',
          platformFee: Math.round(p2.price * 0.05 * 100) / 100,
          vendorPayout: Math.round(p2.price * 0.95 * 100) / 100,
        },
      ],
      shippingAddress: buyer.address,
      paymentMethod: 'Stripe',
      paymentResult: {
        id: 'txn_mock_seed_101',
        status: 'succeeded',
        update_time: new Date().toISOString(),
        email_address: buyer.email,
      },
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      isPaid: true,
      paidAt: new Date('2026-02-08'),
      isDelivered: true,
      deliveredAt: new Date('2026-02-12'),
    });

    console.log('Seeded Sample Order.');
    console.log('Database seeding successfully completed!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
