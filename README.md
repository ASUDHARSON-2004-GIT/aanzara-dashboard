# AANZARA Admin Dashboard

Next.js 16 (App Router, Cache Components) + TypeScript + Tailwind v4 + Recharts.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
```

By default the dashboard reads from the built-in demo API (`/api/dashboard/*`).
To use your real backend, copy `.env.example` to `.env.local` and set `API_BASE_URL`.

## Architecture

```
src/
  types/dashboard.ts      API contract (the JSON shapes the backend must return)
  lib/api.ts              typed fetch wrapper (base URL, timeout, ApiError)
  lib/format.ts           currency / number / date formatting
  services/dashboard.ts   one function per endpoint  <- only file that knows URLs
  data/dashboard-data.ts  mock data for the demo API
  app/api/dashboard/      demo API (delete when the real one exists)
  app/page.tsx            composes the page; each panel streams in via <Suspense>
  components/             presentational panels (+ ui/ shared primitives)
```

## Endpoints expected from the backend (GET, JSON)

| Path                        | Returns                    |
| --------------------------- | -------------------------- |
| `/dashboard/summary`        | `DashboardSummary`         |
| `/dashboard/sales`          | `SalesOverview`            |
| `/dashboard/order-status`   | `OrderStatusBreakdown[]`   |
| `/dashboard/recent-orders`  | `RecentOrder[]`            |
| `/dashboard/top-products`   | `TopProduct[]`             |
| `/dashboard/low-stock`      | `LowStockProduct[]`        |
