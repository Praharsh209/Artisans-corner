# 🌿 Artisan's Corner - Multi-Vendor Handmade Marketplace

**Artisan's Corner** is a full-stack multi-vendor e-commerce marketplace dedicated to handcrafted goods, ceramics, handwoven textiles, jewelry, and woodcraft. Built with a clean, beginner-friendly **MERN Stack** (MongoDB, Express, React with Vite, Node.js), **Tailwind CSS**, **Redux Toolkit**, **React Router**, **Stripe test mode payments**, and **Cloudinary image uploads**.

---

## 🌟 Key Features

### 🛍️ Buyer Features
- **Browse & Search:** Explore handcrafted pieces with live keyword search, category filtering (Ceramics, Textiles, Jewelry, Woodcraft, Botanicals, Leather), price range filtering, and stock filtering.
- **Product Details:** High-resolution photo galleries, maker studio badges, real customer reviews, and interactive star ratings.
- **Persistent Basket:** Redux Toolkit cart synchronized with `localStorage` (quantity steppers capped at stock, free shipping calculations over ₹999).
- **Secure Stripe Checkout:** Real Stripe Elements card payments. Prices are **strictly recalculated on the backend directly from MongoDB** before creating the Payment Intent to prevent client-side manipulation.
- **Order Tracking & Invoices:** Visual progression timeline (`Pending` → `Processing` → `Shipped` → `Delivered`) and itemized breakdown.
- **Reviews & Ratings:** Submit verified product reviews and 1-5 star ratings that update product averages in real time.
- **Account Profile & Upgrades:** Edit shipping addresses, passwords, or upgrade to an Artisan Seller account with 1-click.

### 🏺 Artisan Vendor Features
- **Vendor Onboarding:** Register as a maker or upgrade existing buyer account; configure Studio Name, Bio, Avatar, and Banner photography.
- **Studio Dashboard:** Real-time metrics for Net Creator Earnings (95% creator payout / 5% marketplace fee), Active Creations count, Total Orders, and Pending Shipments.
- **Inventory Management:** Full CRUD operations on products with stock indicators, tags, price, and categories.
- **Cloudinary Image Upload:** Upload high-resolution product photography directly to Cloudinary via Multer with live previews and direct URL fallback.
- **Order Fulfillment Console:** View customer orders containing your items, inspect buyer shipping details, and update fulfillment status (`Pending` → `Processing` → `Shipped` → `Delivered`).

---

## 🔑 Demo Login Credentials

For testing and grading convenience, the database seeder includes pre-configured accounts:

| Role | Email | Password | Shop / Studio Name |
| :--- | :--- | :--- | :--- |
| **Buyer** | `buyer@artisans.com` | `buyer123` | *N/A (Ananya Sharma)* |
| **Artisan Vendor** | `vendor@artisans.com` | `vendor123` | Jaipur Heritage Pottery & Clay (Rajesh Kumawat) |
| **Artisan Vendor** | `artisan2@artisans.com` | `vendor123` | Kutch Handlooms & Botanicals (Meera Patel) |
| **Both (Buyer & Vendor)**| `artisan3@artisans.com` | `vendor123` | Konark Woodcraft & Filigree (Deepak Mohanty) |

> 💡 **Tip:** The Login page includes convenient **"Demo Buyer"** and **"Demo Vendor"** 1-click fill buttons for instant testing.

---

## 💳 Stripe Test Card Information

When testing the checkout flow in test mode, you can use Stripe's official test credentials:
- **Card Number:** `4242 4242 4242 4242`
- **Expiration Date:** Any valid future month/year (e.g., `12/28`)
- **CVC / CVV:** Any 3 digits (e.g., `123`)
- **Postal Code:** Any valid 5-digit zip (e.g., `97201`)

---

## 📁 Project Structure

```
artisans-corner/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB Mongoose connection
│   ├── controllers/
│   │   ├── authController.js   # Auth, profiles, and vendor onboarding
│   │   ├── categoryController.js # Category queries
│   │   ├── orderController.js  # Stripe payment intents & fulfillment
│   │   ├── productController.js# Product CRUD & reviews
│   │   └── uploadController.js # Cloudinary image upload stream
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT protect & isVendor authorization
│   │   └── errorMiddleware.js  # 404 and global error handlers
│   ├── models/
│   │   ├── Category.js         # Category schema
│   │   ├── Order.js            # Multi-vendor order schema & line items
│   │   ├── Product.js          # Product schema with reviews
│   │   └── User.js             # User schema with bcrypt & shopProfile
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth
│   │   ├── categoryRoutes.js   # /api/categories
│   │   ├── orderRoutes.js      # /api/orders
│   │   ├── productRoutes.js    # /api/products
│   │   └── uploadRoutes.js     # /api/upload
│   ├── utils/
│   │   └── seeder.js           # Database seeder with sample artisanal goods
│   ├── .env.example
│   ├── .env
│   ├── server.js               # Express app entry point
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js        # Axios client with JWT interceptor
│   │   ├── components/
│   │   │   ├── common/         # Navbar, Footer, ProductCard, RatingStars, Guards
│   │   │   └── home/           # HeroSection, CategoryGrid, FeaturedArtisans, ValueProps
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx    # Catalog with filters & pagination
│   │   │   ├── ProductDetails.jsx # Details, gallery & reviews
│   │   │   ├── Cart.jsx        # Basket & calculation summary
│   │   │   ├── Checkout.jsx    # Stripe Elements & Shipping form
│   │   │   ├── OrderSuccess.jsx# Confirmation screen
│   │   │   ├── OrderHistory.jsx# Buyer orders list
│   │   │   ├── OrderDetails.jsx# Visual fulfillment tracker & invoice
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx     # User settings & vendor onboarding
│   │   │   └── vendor/
│   │   │       ├── VendorDashboard.jsx # Stats & earnings
│   │   │       ├── VendorProducts.jsx  # Inventory management
│   │   │       ├── AddEditProduct.jsx  # Product creator & Cloudinary upload
│   │   │       ├── VendorOrders.jsx    # Fulfillment status console
│   │   │       └── ShopProfile.jsx     # Storefront branding & banner
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   └── cartSlice.js
│   │   │   └── index.js        # Redux Toolkit store
│   │   ├── App.jsx             # React Router routing
│   │   ├── main.jsx            # React root with Redux Provider
│   │   └── index.css           # Tailwind styling & Google Fonts
│   ├── index.html
│   ├── tailwind.config.js      # Moss Green, Terracotta & Parchment palette
│   ├── vite.config.js          # Vite config with /api proxy
│   └── package.json
└── README.md
```

---

## 🛠️ Step-by-Step Installation & Setup

### 1. Prerequisites
- **Node.js**: v18+ or v20+ recommended
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017`) or MongoDB Atlas URI.

---

### 2. Backend Setup

1. Open a terminal and navigate to `backend/`:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env` or update `backend/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/artisans_corner
   JWT_SECRET=artisans_corner_super_secret_jwt_key_secure_2026

   # Cloudinary (Sign up free at https://cloudinary.com)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Stripe Test Mode (Get key at https://dashboard.stripe.com/test/apikeys)
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   ```

4. Seed the database with sample artisanal catalog & accounts:
   ```bash
   npm run seed
   ```

5. Start the backend server:
   ```bash
   npm run dev
   # Server will run at http://localhost:5000
   ```

---

### 3. Frontend Setup

1. Open a second terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Set your Stripe publishable key:
   Create a `frontend/.env` file:
   ```env
   VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_publishable_key
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   # Web app will be accessible at http://localhost:3000
   ```

---

## 🎨 Design & Aesthetic Details
- **Primary Color:** Moss Green (`#2D5A27`, `#21441D`)
- **Accent Color:** Terracotta Clay (`#C86446`, `#B25034`)
- **Background:** Warm Kraft & Parchment (`#FAF8F5`, `#F5EFE6`)
- **Typography:** Google Fonts *Playfair Display* (headings) & *Plus Jakarta Sans* (body).
- **Responsive Layout:** Adaptive desktop, tablet, and mobile navigation drawers and grids.

---

## 🛡️ Security Highlights
- **Backend Price Integrity:** Cart prices submitted by clients are never trusted for payment calculations; product prices and stock availability are always checked directly against MongoDB before creating Stripe PaymentIntents.
- **Role Authorization:** Protected vendor routes ensure users can only create, update, or delete their own products and order items.
- **Bcrypt & JWT:** Safe salted password hashing and stateless token authentication.
