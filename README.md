# ZED INFORMATIQUE

Next.js 15 (App Router) + Convex + next-intl production site for Zed Informatique — Algeria-based PC hardware e-commerce + services.

## Stack

- **Framework:** Next.js 15 App Router + Turbopack
- **Language:** TypeScript strict
- **Styling:** Tailwind CSS v3 + Material Symbols + Inter
- **Backend:** Convex (schema, queries, mutations, real-time)
- **i18n:** next-intl (fr default, ar RTL)
- **State:** Zustand (cart, localStorage persistence)
- **Forms:** React Hook Form + Zod

## Getting started

```bash
# 1. Install deps
npm install

# 2. Set env
cp .env.local.example .env.local
#    Fill NEXT_PUBLIC_CONVEX_URL after `npx convex dev`
#    Set ADMIN_PASSWORD and NEXT_PUBLIC_WHATSAPP_NUMBER

# 3. Start Convex dev
npx convex dev

# 4. Seed the database
npx convex run seed:default

# 5. Start the site
npm run dev
```

Visit http://localhost:3000 (redirects to /fr).

## Routes

- `/fr`, `/ar` — localized root
- `/fr/shop` — categories
- `/fr/shop/[category]` — category listing
- `/fr/product/[slug]` — product detail
- `/fr/configurator` — PC configurator with compatibility engine
- `/fr/prebuilt/[slug]` — ready-to-go PCs
- `/fr/cart`, `/fr/checkout`, `/fr/order/[id]` — checkout flow
- `/fr/about`, `/fr/support`
- `/admin/login`, `/admin`, `/admin/products`, `/admin/categories`, `/admin/orders`

## Admin

Password-gated by `ADMIN_PASSWORD` env var. Session stored in httpOnly cookie `admin_session`. Middleware redirects unauthenticated `/admin/*` → `/admin/login`.

## Deployment

- **Frontend:** Vercel (auto)
- **Backend:** `npx convex deploy` → set `NEXT_PUBLIC_CONVEX_URL` in Vercel env to production URL.
