# EthioMart

A full-stack e-commerce platform optimized for the Ethiopian market, built as a pnpm monorepo with TypeScript.

## Architecture

- **Monorepo**: pnpm workspaces
- **Frontend**: React + Vite + TailwindCSS v4 + shadcn/ui (`artifacts/marketplace`) — port 5000
- **Backend**: Express 5 REST API (`artifacts/api-server`) — port 8080
- **Database**: PostgreSQL + Drizzle ORM (`lib/db`)
- **State Management**: TanStack Query v5
- **Routing**: Wouter
- **Animations**: Framer Motion

## Running the App

Two workflows are configured:
1. **Start Backend** — `PORT=8080 pnpm --filter @workspace/api-server run dev`
2. **Start application** — `PORT=5000 pnpm --filter @workspace/marketplace run dev`

The frontend proxies `/api` requests to the backend (port 8080) via Vite's dev proxy.

## Database

Uses Replit's built-in PostgreSQL. Schema is managed with Drizzle ORM.

- Push schema: `pnpm --filter @workspace/db run push-force`
- Seed data: Automatically seeded on first server start via `/api/seed`

## Key Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (auto-set by Replit)
- `PORT` — Server port (set per workflow command)
- `API_PORT` — API server port for Vite proxy (defaults to 8080)

## Demo Accounts

- **Admin**: admin@ethiomart.com / admin123
- **Seller**: seller1@ethiomart.com / seller123
- **Customer**: customer@ethiomart.com / customer123

## Ethiopian Market Features

- Currency: ETB (Ethiopian Birr)
- Payment methods: Telebirr, CBE Birr, Cash on Delivery
- Regions: All Ethiopian regions
- Warm Ethiopian color palette

## Project Structure

```
├── artifacts/
│   ├── api-server/        # Express API (port 8080)
│   ├── marketplace/       # React + Vite frontend (port 5000)
│   └── mockup-sandbox/    # Component preview server
├── lib/
│   ├── api-spec/          # OpenAPI spec + Orval config
│   ├── api-client-react/  # Generated React Query hooks
│   ├── api-zod/           # Generated Zod schemas
│   └── db/                # Drizzle ORM schema + DB connection
└── scripts/               # Utility scripts
```
