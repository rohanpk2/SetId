# Settld — Landing Site

Marketing landing page for Settld, built with Vite + React 19 + React Router.

## Stack

- **Vite 8** — dev server + build
- **React 19** — UI
- **React Router 7** — client-side routing
- All styles are hand-rolled CSS using the design tokens from the mobile app (see `src/styles/tokens.css`)
- No animation library — every transition is CSS `@keyframes`
- Respects `prefers-reduced-motion`

## Routes

| Path | Page |
|---|---|
| `/` | Landing (hero, how-it-works, features, FAQ, CTA) |
| `/support` | Help center + contact form (mailto) |
| `/marketing` | Press kit + brand assets + palette |
| `/privacy` | Privacy policy (draft boilerplate — have counsel review) |

## Getting started

```bash
cd web/landing
npm install
npm run dev     # http://localhost:5174
npm run build   # → dist/
npm run preview # preview production build
```

## Deploy

`vercel.json` is pre-configured for SPA rewrites. Deploy to Vercel as a new project with `web/landing` as the root directory.

```bash
cd web/landing
vercel --prod
```

## Design system

All tokens live in `src/styles/tokens.css` and mirror `frontend/ReactNativeApp/src/theme.js`:

- **Brand greens**: `#105D4B` (landing), `#0d4a3c` (dim)
- **Mint scale**: `#4FD1A7` → `#1FA87A`
- **Mint tints**: `#E6F4F0`, `#F0F9F6`
- **Radii**: `8 / 12 / 16 / 24 / 32 / full`
- **Fonts**: Manrope 800 display, Inter 400-700 body

## Updating placeholder links

Swap these placeholders before launch:

- `src/components/CTABand.jsx` — `APPSTORE_URL` and `PLAYSTORE_URL` (currently `#`)
- `src/pages/SupportPage.jsx` — `SUPPORT_EMAIL` (placeholder `support@settld.live`)
- `src/pages/MarketingPage.jsx` — `press@settld.live` and logo download links
- `src/pages/PrivacyPage.jsx` — `privacy@settld.live`, legal jurisdiction, and retention periods should be reviewed by counsel

## Assets

Product screenshots live in `src/assets/`:

- `IMG_4972.PNG` — Dashboard (used in hero)
- `IMG_4973.PNG` — Scan / unassigned items
- `IMG_4974.PNG` — Share sheet
- `IMG_4975.PNG` — Split between members
- `IMG_4976.PNG` — Payment tracking

Screenshots are wrapped in a pure-CSS iPhone 15 Pro frame (`src/components/PhoneFrame.jsx`) — no external image assets required.
