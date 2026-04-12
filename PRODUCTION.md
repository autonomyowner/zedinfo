# Zed Informatique — Go to Production

The codebase is production-ready and `next build` passes cleanly. The remaining
steps require interactive logins (Convex + Vercel) and must be run by you in a
real terminal — they cannot be scripted headlessly.

## 1. Provision Convex (once)

```bash
cd "D:/ZED INFORMA/stitch/zed-informatique"
npx convex dev --once
```

This will:
- Open a browser for Convex login
- Prompt for a project name (suggest: `zed-informatique`)
- Write real `convex/_generated/*` files (overwriting our stubs)
- Populate `.env.local` with `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL`

## 2. Seed the database

```bash
npx convex run seed:default
```

Populates 11 categories and 18 sample products with typed specs for the
configurator.

## 3. Fill in `.env.local`

```
NEXT_PUBLIC_CONVEX_URL=<from step 1>
CONVEX_DEPLOYMENT=<from step 1>
ADMIN_PASSWORD=<pick a strong password>
NEXT_PUBLIC_WHATSAPP_NUMBER=213XXXXXXXXX
```

## 4. Deploy Convex production functions

```bash
npx convex deploy
```

Returns a production `NEXT_PUBLIC_CONVEX_URL` — use this one on Vercel.

## 5. Deploy to Vercel

```bash
npm i -g vercel
vercel login
vercel link      # link to a new or existing project
vercel --prod
```

In the Vercel dashboard, add environment variables:
- `NEXT_PUBLIC_CONVEX_URL` — from `convex deploy` output
- `ADMIN_PASSWORD`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`

Then redeploy: `vercel --prod`

## 6. Smoke test

- `https://<domain>/fr` — home loads, hero image, categories, featured products
- `https://<domain>/fr/shop/graphics-cards` — category listing
- `https://<domain>/fr/cart` → `/checkout` → place COD order → confirmation
- `https://<domain>/fr/configurator` — incompatible combo shows red error
- `https://<domain>/ar` — RTL layout, Arabic strings
- `https://<domain>/admin/login` — password gate, then dashboard

## Notes

- The `convex/_generated/*` files in the repo are **stubs** using `anyApi` so
  the project builds before Convex is provisioned. Running `npx convex dev`
  will overwrite them with real generated types — that is expected.
- `convex/` is excluded from the root `tsconfig.json` because Convex ships its
  own typechecker. Do not re-include it.
- Admin is French-only and lives outside `[locale]` on purpose.
- Product images currently point at `lh3.googleusercontent.com` (from the Stitch
  mockups). Swap these in admin once you have real catalog photos.
