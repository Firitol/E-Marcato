# EthioMart

A full-stack e-commerce platform optimized for the Ethiopian market, built as a pnpm monorepo with TypeScript.

## Architecture

- **Monorepo**: pnpm workspaces
- **Frontend**: React + Vite + TailwindCSS v4 + shadcn/ui (`artifacts/marketplace`) — port 5000
- **Backend**: Express 5 REST API (`artifacts/api-server`) — port 8080 (dev) / port 5000 (production)
- **Database**: PostgreSQL + Drizzle ORM (`lib/db`)
- **State Management**: TanStack Query v5
- **Routing**: Wouter
- **Animations**: Framer Motion
- **Auth**: JWT-based stateless sessions (stored in localStorage)

## Running the App

Two workflows configured:
1. **Start Backend** — `PORT=8080 pnpm --filter @workspace/api-server run dev`
2. **Start application** — `PORT=5000 pnpm --filter @workspace/marketplace run dev`

The frontend Vite dev server proxies `/api` requests to the backend (port 8080).

## Production

In production, the API server also serves the built frontend static files (SPA fallback included). A single process handles everything on port 5000.

Build: `pnpm install && pnpm --filter @workspace/db run push-force && PORT=5000 BASE_PATH=/ pnpm --filter @workspace/marketplace run build && pnpm --filter @workspace/api-server run build`
Run: `PORT=5000 node artifacts/api-server/dist/index.js`

## Database

Uses Replit's built-in PostgreSQL. Schema is managed with Drizzle ORM.

- Push schema: `pnpm --filter @workspace/db run push-force`
- Seed data: Automatically seeded on first server start (checks if users table is empty)

## Key Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (auto-set by Replit)
- `JWT_SECRET` — Secret for signing JWT auth tokens (set in Replit Secrets)
- `PORT` — Server port (set per workflow/deployment command)

## Demo Accounts

- **Admin**: admin@ethiomart.com / admin123
- **Seller**: seller1@ethiomart.com / seller123
- **Customer**: customer@ethiomart.com / customer123

## Ethiopian Market Features

- Currency: ETB (Ethiopian Birr)
- Payment methods: Telebirr, CBE Birr, Cash on Delivery
- All Ethiopian regions supported
- Warm Ethiopian color palette and traditional textile imagery

## Project Structure

```
├── artifacts/
│   ├── api-server/        # Express API (port 8080 dev / 5000 prod)
│   ├── marketplace/       # React + Vite frontend (port 5000)
│   └── mockup-sandbox/    # Component preview server
├── lib/
│   ├── api-spec/          # OpenAPI spec + Orval config
│   ├── api-client-react/  # Generated React Query hooks
│   ├── api-zod/           # Generated Zod schemas
│   └── db/                # Drizzle ORM schema + DB connection
└── scripts/               # Utility scripts
```

## API Routes

All under `/api/`:
- `auth` — login, register, logout, me
- `products` — CRUD, listing, detail
- `categories` — listing
- `search` — full-text search
- `cart` — get, add, update, remove
- `orders` — create, list, detail, status update
- `payments` — Telebirr, CBE Birr (stub)
- `sellers` — register, profile, analytics, orders
- `reviews` — product reviews
- `recommendations` — homepage, similar products
- `wishlist` — list, add, remove
- `notifications` — list
- `admin` — dashboard, users, sellers, orders, products, analytics
