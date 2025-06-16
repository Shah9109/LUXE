# LUXE - Modern E-Commerce Website

A fully functional modern e-commerce website built with React, Next.js, Node.js, Express, and MongoDB. Inspired by premium fashion websites, featuring a clean, minimal design with comprehensive shopping functionality.

![LUXE Homepage](https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)

## ✨ Features

### Frontend Features
- **Modern Design**: Clean, minimal interface inspired by premium fashion brands
- **Responsive Layout**: Fully responsive design that works on all devices
- **Hero Section**: Compelling hero banner with call-to-action buttons
- **Product Catalog**: Grid layout with hover effects and quick actions
- **Category Pages**: Dedicated pages for Men's, Women's, and Accessories
- **Product Detail Pages**: Comprehensive product information with image galleries
- **Shopping Cart**: Add/remove items with quantity management
- **Checkout Process**: Complete checkout flow with address and payment forms
- **User Authentication**: Login/signup with JWT token management
- **Search Functionality**: Full-text search with filters
- **Newsletter Signup**: Email subscription with validation
- **Smooth Animations**: Framer Motion animations throughout the site

### Backend Features
- **RESTful API**: Comprehensive API with proper error handling
- **User Management**: Registration, login, profile management
- **Product Management**: CRUD operations with image handling
- **Order System**: Complete order processing and management
- **Admin Panel**: Product and order management for administrators
- **Authentication**: JWT-based authentication with role-based access
- **Data Validation**: Express-validator for input validation
- **Security**: Helmet, CORS, and rate limiting
- **Database**: MongoDB with Mongoose ODM

### Tech Stack
- **Frontend**: React 18, Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **Styling**: Tailwind CSS, Custom CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Validation**: Express Validator

## 📁 Project Structure

```
ecommerce-website/
├── frontend/                 # Next.js React application
│   ├── app/                 # App router pages
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Homepage
│   ├── components/          # React components
│   │   ├── Header.tsx       # Navigation header
│   │   ├── Hero.tsx         # Hero section
│   │   ├── FeaturedProducts.tsx
│   │   ├── CategorySection.tsx
│   │   ├── Newsletter.tsx
│   │   ├── Footer.tsx
│   │   └── AuthModal.tsx    # Login/signup modal
│   ├── contexts/            # React contexts
│   │   ├── AuthContext.tsx  # Authentication context
│   │   └── CartContext.tsx  # Shopping cart context
│   ├── next.config.js       # Next.js configuration
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   ├── postcss.config.js    # PostCSS configuration
│   ├── tsconfig.json        # TypeScript configuration
│   └── package.json         # Frontend dependencies
├── backend/                 # Express.js API server
│   ├── models/             # MongoDB models
│   │   ├── User.js         # User model
│   │   ├── Product.js      # Product model
│   │   └── Order.js        # Order model
│   ├── routes/             # API routes
│   │   ├── auth.js         # Authentication routes
│   │   ├── products.js     # Product routes
│   │   ├── categories.js   # Category routes
│   │   ├── orders.js       # Order routes
│   │   ├── newsletter.js   # Newsletter routes
│   │   └── admin.js        # Admin routes
│   ├── middleware/         # Express middleware
│   │   └── auth.js         # Authentication middleware
│   ├── scripts/            # Utility scripts
│   │   └── seed.js         # Database seeding script
│   ├── server.js           # Express server entry point
│   └── package.json        # Backend dependencies
├── package.json            # Root package.json
└── README.md              # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-website
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   Create `.env` file in the `backend` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas connection string in MONGODB_URI
   ```

5. **Seed the database**
   ```bash
   cd backend
   npm run seed
   ```

6. **Start the development servers**
   ```bash
   # From the root directory
   npm run dev
   ```

   This will start:
   - Frontend on http://localhost:3000
   - Backend on http://localhost:5000

## 🛠️ Development

### Frontend Development
```bash
cd frontend
npm run dev     # Start development server
npm run build   # Build for production
npm run start   # Start production server
npm run lint    # Run ESLint
```

### Backend Development
```bash
cd backend
npm run dev     # Start with nodemon
npm start       # Start production server
npm run seed    # Seed database with sample data
```

## 🎨 Design Features

### Color Scheme
- **Primary**: Black (#000000) for text and buttons
- **Secondary**: White (#FFFFFF) for backgrounds
- **Accent**: Gray shades for subtle elements
- **Interactive**: Hover states with smooth transitions

### Typography
- **Font**: Inter (Google Fonts)
- **Hierarchy**: Clear heading hierarchy with proper spacing
- **Readability**: Optimized line heights and letter spacing

### Components
- **Cards**: Clean product cards with hover effects
- **Buttons**: Consistent button styles with hover states
- **Forms**: Styled input fields with validation states
- **Navigation**: Sticky header with mobile-responsive menu

## 📱 Responsive Design

The website is fully responsive and optimized for:
- **Desktop**: Full featured experience with hover effects
- **Tablet**: Adapted layout with touch-friendly interactions
- **Mobile**: Optimized for small screens with collapsible navigation

## 🔐 Authentication

### User Roles
- **Customer**: Can browse products, make purchases, manage profile
- **Admin**: Full access to product and order management

### Security Features
- JWT token-based authentication
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS protection

## 📦 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get single product
- `POST /api/products/:id/reviews` - Add product review

### Categories
- `GET /api/categories/:category` - Get products by category

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order

### Admin (Protected)
- `GET /api/admin/stats` - Dashboard statistics
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

## 🗄️ Database Schema

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  addresses: Array,
  wishlist: Array,
  createdAt: Date
}
```

### Product Schema
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  images: Array,
  sizes: Array,
  featured: Boolean,
  rating: Object,
  reviews: Array,
  createdAt: Date
}
```

### Order Schema
```javascript
{
  user: ObjectId,
  items: Array,
  shippingAddress: Object,
  paymentMethod: String,
  total: Number,
  status: String,
  createdAt: Date
}
```

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npm i -g vercel
   vercel --prod
   ```

### Backend Deployment (Railway/Heroku)

1. **Set production environment variables**
   ```env
   NODE_ENV=production
   MONGODB_URI=your-mongodb-atlas-uri
   JWT_SECRET=your-production-jwt-secret
   FRONTEND_URL=your-frontend-domain
   ```

2. **Deploy to Railway**
   ```bash
   # Connect to Railway
   npm i -g @railway/cli
   railway login
   railway deploy
   ```

### Database (MongoDB Atlas)

1. Create MongoDB Atlas account
2. Create new cluster
3. Add database user
4. Whitelist IP addresses
5. Get connection string and update MONGODB_URI

## 🎯 Sample Login Credentials

After seeding the database, you can use these credentials:

**Admin Account:**
- Email: admin@luxe.com
- Password: admin123

**Customer Account:**
- Email: john@example.com
- Password: password123

## 🛒 E-commerce Features

### Shopping Cart
- Add/remove products
- Update quantities
- Persistent cart (localStorage)
- Cart total calculation

### Checkout Process
1. Cart review
2. Shipping address
3. Payment method selection
4. Order confirmation

### Order Management
- Order history for customers
- Order status tracking
- Admin order management

## 🎨 Customization

### Styling
- Modify `frontend/tailwind.config.js` for theme customization
- Update colors in `frontend/app/globals.css`
- Component-specific styles in individual component files

### Adding New Features
1. Create new React components in `frontend/components/`
2. Add API routes in `backend/routes/`
3. Update database models if needed
4. Add proper validation and error handling

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📧 Support

For support or questions, please contact:
- Email: support@luxe.com
- GitHub Issues: [Create an issue](repository-url/issues)

---

**Built with ❤️ by the LUXE team** 