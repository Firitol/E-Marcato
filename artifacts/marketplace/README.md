# E-Marcato - Ethiopia's Premier E-Commerce Marketplace

A modern, production-ready e-commerce platform built with React, TypeScript, and Tailwind CSS. E-Marcato provides a seamless shopping experience with support for multiple user roles, secure payments, and fast delivery.

## Features

### Core E-Commerce Features
- Browse products with advanced search and filtering
- Product details with images, reviews, and ratings
- Shopping cart management
- Secure checkout process
- Order history and tracking
- Wishlist functionality
- Multiple payment options (Telebirr, CBE Birr)

### User Roles
- **Customers**: Shopping, reviews, order management
- **Sellers**: Product management, order fulfillment, analytics
- **Admins**: System management, user management, analytics

### Technical Features
- Responsive design for mobile, tablet, and desktop
- Server-side API integration with fallback handling
- Authentication with JWT tokens
- Error boundaries for robust error handling
- Global state management with React Query
- Type-safe with TypeScript
- Dark mode support ready
- Accessibility-first components (shadcn/ui)

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Wouter** - Client-side routing
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **React Query** - Data fetching and caching
- **Lucide React** - Icons

### Build & Dev
- **Node.js 18+**
- **pnpm** - Package manager
- **PostCSS** - CSS processing
- **Tailwind CSS** - Utility-first CSS

## Project Structure

```
src/
├── App.tsx                 # Main app with routing
├── main.tsx               # Entry point
├── pages/                 # Page components
│   ├── HomePage.tsx
│   ├── ProductDetails.tsx
│   ├── CartPage.tsx
│   ├── CheckoutPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── SearchPage.tsx
│   ├── WishlistPage.tsx
│   ├── OrderHistory.tsx
│   ├── BecomeSellerPage.tsx
│   ├── seller/           # Seller dashboard pages
│   └── admin/            # Admin dashboard pages
├── components/
│   ├── layout/           # Layout components
│   ├── product/          # Product components
│   ├── ui/               # UI primitives (shadcn)
│   └── error-boundary.tsx
├── lib/
│   ├── api.ts           # API client setup
│   └── auth-context.tsx # Auth state management
├── hooks/
│   └── use-toast.ts     # Toast notifications
└── index.css            # Global styles
```

## Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Navigate to marketplace directory
cd artifacts/marketplace

# Install marketplace dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm dev
```

The app will open at `http://localhost:5000`

### Production Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Configuration

### Environment Variables

Create a `.env` file in the marketplace directory:

```env
VITE_API_URL=http://localhost:8080/api
```

### Tailwind & PostCSS

- `tailwind.config.ts` - Tailwind configuration with color themes
- `postcss.config.js` - PostCSS with Tailwind and Autoprefixer

## API Integration

The app is configured to work with the E-Marcato API server. Key endpoints:

- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/recommendations/homepage` - Homepage recommendations
- `GET /api/products` - Search products
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `GET /api/orders` - Get user orders

The app gracefully handles API failures with fallback UI and timeout protection.

## Pages Overview

### Public Pages
- **Home** (`/`) - Hero section, featured products, promotions
- **Search** (`/search`) - Product search with filters
- **Category** (`/category/:slug`) - Browse by category
- **Product Details** (`/product/:id`) - Detailed product view
- **Wishlist** (`/wishlist`) - Saved products

### Auth Pages
- **Login** (`/login`) - User login with demo credentials
- **Register** (`/register`) - New user registration
- **Become Seller** (`/become-seller`) - Seller registration

### Protected Pages
- **Cart** (`/cart`) - Shopping cart
- **Checkout** (`/checkout`) - Order checkout
- **Orders** (`/orders`) - Order history
- **Order Detail** (`/orders/:id`) - Single order details

### Seller Pages
- **Dashboard** (`/seller`) - Seller overview
- **Products** (`/seller/products`) - Manage products
- **Orders** (`/seller/orders`) - Manage orders
- **Analytics** (`/seller/analytics`) - Sales analytics

### Admin Pages
- **Dashboard** (`/admin`) - Admin overview
- **Users** (`/admin/users`) - User management
- **Sellers** (`/admin/sellers`) - Seller management
- **Orders** (`/admin/orders`) - Order management
- **Products** (`/admin/products`) - Product management
- **Analytics** (`/admin/analytics`) - System analytics

## Demo Credentials

The app includes demo login credentials for testing:

- **Customer**: customer@ethiomart.com / customer123
- **Seller**: seller1@ethiomart.com / seller123
- **Admin**: admin@ethiomart.com / admin123

## Error Handling

- Global error boundary catches React errors
- API errors are handled gracefully with fallback UI
- Auth timeouts prevent infinite loading
- Network failures show user-friendly messages

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Code splitting with Vite
- CSS tree-shaking with Tailwind
- Image optimization ready
- Lazy loading support for routes
- React Query caching strategy

## Accessibility

All components follow WCAG 2.1 standards:
- Semantic HTML
- ARIA attributes
- Keyboard navigation
- Screen reader support
- Color contrast compliance

## Deployment

The app is ready for deployment on Vercel or any static hosting service:

```bash
pnpm build
```

The `dist/` folder contains production-ready files.

## License

Copyright 2024 Firitol. All rights reserved.

## Support

For issues or questions, please contact support@ethiomart.com
