# EthioMart

## Overview

EthioMart is a full e-commerce ecosystem optimized for Ethiopian emerging markets. Built as a pnpm monorepo with TypeScript, it includes:

- **Customer Marketplace** — homepage, product browsing, search, cart, checkout, orders, wishlist
- **Seller Portal** — dashboard, product management, order management, analytics
- **Admin Panel** — platform overview, user management, seller approval, order tracking, analytics
- **REST API Server** — 30+ endpoints covering all features
- **PostgreSQL Database** — 9 tables with seeded demo data

## Stack

- **Monorepo**: pnpm workspaces
- **Node.js**: 24
- **TypeScript**: 5.9
- **Frontend**: React + Vite + TailwindCSS v4 + shadcn/ui
- **Backend**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **State Management**: TanStack Query v5
- **Routing**: Wouter
- **Animations**: Framer Motion
- **Charts**: Recharts

## Ethiopian Market Features

- **Currency**: ETB (Ethiopian Birr) throughout the UI
- **Payment methods**: Telebirr, CBE Birr, Cash on Delivery
- **Regions**: All Ethiopian regions in forms
- **Cities**: Major Ethiopian cities for seller registration
- **Design**: Warm Ethiopian color palette, traditional textiles hero image

## Demo Accounts

- **Admin**: admin@ethiomart.com / admin123
- **Seller**: seller1@ethiomart.com / seller123
- **Customer**: customer@ethiomart.com / customer123

## Structure

```
artifacts-monorepo/
├── artifacts/
│   ├── api-server/        # Express API (port 8080)
│   ├── marketplace/       # React + Vite frontend
│   └── mockup-sandbox/    # Component preview server
├── lib/
│   ├── api-spec/          # OpenAPI spec + Orval config
│   ├── api-client-react/  # Generated React Query hooks (not used in UI)
│   ├── api-zod/           # Generated Zod schemas
│   └── db/                # Drizzle ORM schema + DB connection
└── scripts/               # Utility scripts
```

## Database Schema

9 tables: `users`, `categories`, `sellers`, `products`, `orders`, `orderItems`, `reviews`, `cart`, `wishlist`, `notifications`

Push schema: `pnpm --filter @workspace/db run push-force`
Seed data: `pnpm --filter @workspace/api-server run dev` then `curl http://localhost:8080/api/seed`

## Frontend Pages

### Customer-facing
- `/` — HomePage with hero, featured products, trending, promo banner
- `/search` — Search with filters (category, price, sort)
- `/category/:slug` — Category browse
- `/product/:id` — Product detail with reviews, similar products
- `/cart` — Shopping cart
- `/checkout` — Multi-step checkout (address + Ethiopian payment)
- `/orders` — Order history
- `/orders/:id` — Order detail with tracking timeline
- `/wishlist` — Saved items
- `/login` — Sign in with demo account buttons
- `/register` — Create account
- `/become-seller` — Seller application form

### Seller Portal (`/seller/*`)
- `/seller` — Dashboard with stats + revenue chart
- `/seller/products` — Product listing + add product modal
- `/seller/orders` — Order management with status updates
- `/seller/analytics` — Charts: revenue over time, order status pie

### Admin Panel (`/admin/*`)
- `/admin` — Platform overview: stats, alerts, recent orders
- `/admin/users` — User search, role filter, table view
- `/admin/sellers` — Seller approval workflow
- `/admin/orders` — All platform orders
- `/admin/products` — Product moderation (approve/reject)
- `/admin/analytics` — Revenue, user growth, category breakdown, payment methods

## API Routes

All routes under `/api/`:
- `auth` — login, register, logout, me
- `products` — CRUD, listing, detail
- `categories` — listing
- `search` — full-text search
- `cart` — get, add, update, remove
- `orders` — create, list, detail, status update
- `payments` — Telebirr, CBE Birr (stub), initiate
- `sellers` — register, profile, analytics, orders
- `reviews` — product reviews
- `recommendations` — homepage, similar products
- `wishlist` — list, add, remove
- `notifications` — list
- `admin` — dashboard, users, sellers, orders, products, analytics

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` (composite: true). Root `tsconfig.json` lists all packages as project references.

- Run typecheck: `pnpm run typecheck`
- DB schema push: `pnpm --filter @workspace/db run push-force`
- API codegen: `pnpm --filter @workspace/api-spec run codegen`
