# PawPal AI — Project Context for AI Assistants

## What This Project Is

PawPal AI is a smart pet health companion app. This repo currently contains the **frontend client** — a visually striking dark cosmic landing page and app shell built for hackathon demonstration. There is no backend yet.

The app uses a particle constellation system (HTML5 Canvas) to render animated pet silhouettes (cat, dog, AI bot) as the primary visual hook.

---

## Tech Stack

| Layer | Tool | Version |
|-------|------|---------|
| Build | Vite | 8.x |
| Framework | React | 19 |
| Language | TypeScript | 6.x |
| Styling | Tailwind CSS | v4 (uses `@theme` block, no tailwind.config) |
| Routing | React Router DOM | v7 (v6-compatible API) |
| Animation | Framer Motion | v12 |
| Icons | Lucide React | latest |
| Utilities | clsx + tailwind-merge | via `cn()` helper |

---

## Project Structure

```
/client                         ← Vite React app root
├── src/
│   ├── main.tsx                ← Entry point (StrictMode + App)
│   ├── App.tsx                 ← React Router config
│   ├── index.css               ← Tailwind v4 directives + @theme design tokens
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx      ← 3 variants: primary, outline, ghost
│   │   │   ├── Card.tsx        ← Transparent card with hairline border
│   │   │   ├── Typography.tsx  ← 5 variants: display, headline, body, eyebrow, caption
│   │   │   └── PlaceholderPage.tsx ← Reusable "Coming Soon" page template
│   │   ├── Navigation.tsx      ← Fixed top nav bar (landing page)
│   │   ├── HeroSection.tsx     ← Cat constellation + headline + CTA
│   │   ├── DogSection.tsx      ← Dog constellation + AI messaging
│   │   ├── BotCatSection.tsx   ← Bot+cat constellation + login/signup CTA
│   │   ├── ParticleConstellation.tsx ← Canvas-based particle renderer
│   │   ├── AppShell.tsx        ← Sidebar + Outlet layout wrapper
│   │   └── Sidebar.tsx         ← App navigation sidebar (6 routes)
│   ├── pages/
│   │   ├── LandingPage.tsx     ← Composes Nav + Hero + Dog + BotCat sections
│   │   ├── Dashboard.tsx       ← Placeholder
│   │   ├── MyPets.tsx          ← Placeholder
│   │   ├── AIChat.tsx          ← Placeholder
│   │   ├── Vaccinations.tsx    ← Placeholder
│   │   ├── MedicalRecords.tsx  ← Placeholder
│   │   └── HealthTimeline.tsx  ← Placeholder
│   ├── lib/
│   │   ├── particles.ts        ← Particle system engine (spawn, update, draw, pointInPolygon)
│   │   ├── silhouettes.ts      ← Polygon coordinate data for cat/dog/bot-cat masks
│   │   └── utils.ts            ← cn() helper (clsx + tailwind-merge)
│   ├── styles/
│   │   └── fonts.css           ← Font loading (Acronym + Space Grotesk fallback)
│   └── assets/
├── components.json             ← shadcn/ui config (dark theme, path aliases)
├── vite.config.ts              ← Vite config with Tailwind v4 plugin + @ alias
├── tsconfig.json
├── tsconfig.app.json           ← Has `@/*` path alias to `./src/*`
└── package.json
```

---

## Design System — "Dala" Tokens

All design tokens are defined in `/client/src/index.css` inside the `@theme` block. This is Tailwind CSS v4's native theming approach (no `tailwind.config.js`).

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--color-void` | `#000000` | Background (the only bg color) |
| `--color-bone` | `#ffffff` | Primary text, headings |
| `--color-ash` | `#bdbdbd` | Secondary text, body copy |
| `--color-smoke` | `#9a9a9a` | Tertiary text, captions, inactive nav |
| `--color-plum-voltage` | `#8052ff` | Primary CTA fill, active states |
| `--color-amber-spark` | `#ffb829` | Outline accent (never as CTA fill) |
| `--color-lichen` | `#15846e` | Decorative, particle nodes |

### Typography
- **Font family**: `Acronym` (premium) with system font fallback stack
- **Scale**: caption (12px) → body-sm (14px) → subheading (18px) → heading-sm (24px) → heading (36px) → heading-lg (48px) → display (78px) → hero (113px)
- Each size has corresponding `--leading-*` and `--tracking-*` tokens

### Visual Rules
- **No shadows, no gradients, no elevation** — depth comes from color contrast only
- **24px border radius** on all interactive elements (`--radius-3xl`)
- **Hairline borders**: `border-white/10` (1px solid white at 10% opacity)
- **Single surface layer**: everything sits on void black, no nested bg colors

### Tailwind Usage
Use tokens as utility classes:
- `bg-void`, `text-bone`, `text-ash`, `text-smoke`
- `bg-plum-voltage`, `text-amber-spark`, `text-lichen`
- `font-acronym`
- `text-display`, `text-heading-lg`, `text-body-sm`, etc.
- `leading-display`, `tracking-display`, etc.
- `rounded-3xl` (maps to 24px)
- Spacing: `p-24` = 24px, `gap-60` = 60px, etc.

---

## Routing

| Path | Component | Description |
|------|-----------|-------------|
| `/` | LandingPage | Public marketing page with particle animations |
| `/app` | AppShell | Authenticated layout (sidebar + outlet) |
| `/app/dashboard` | Dashboard | Placeholder |
| `/app/pets` | MyPets | Placeholder |
| `/app/chat` | AIChat | Placeholder |
| `/app/vaccinations` | Vaccinations | Placeholder |
| `/app/records` | MedicalRecords | Placeholder |
| `/app/timeline` | HealthTimeline | Placeholder |
| `*` | Redirect → `/` | Catch-all |

The `/app` index route redirects to `/app/dashboard`.

---

## Particle Constellation System

The visual centerpiece. Canvas-based rendering of thousands of geometric shapes (triangles, circles, diamonds) constrained within silhouette polygon masks.

### Key Files
- `lib/particles.ts` — Core engine: `spawnParticles`, `updateParticle`, `drawParticle`, `pointInPolygon`
- `lib/silhouettes.ts` — Polygon data: `CAT_SILHOUETTE`, `DOG_SILHOUETTE`, `BOT_CAT_SILHOUETTE`
- `components/ParticleConstellation.tsx` — React wrapper with canvas, animation loop, entrance animation

### Behavior
- Particles spawn within silhouette polygons using ray-casting point-in-polygon test
- Sinusoidal drift animation around base positions (floating/breathing effect)
- Scroll-triggered entrance: particles scatter then converge over 1200ms with opacity fade
- IntersectionObserver pauses animation when off-screen
- ResizeObserver recalculates on container resize (150ms debounce)
- `prefers-reduced-motion` shows static frame
- Max 2000 particles cap

---

## What's Been Implemented

✅ Project scaffolding (Vite + React + TS)
✅ All dependencies installed
✅ Design token system (Tailwind v4 @theme)
✅ Base components (Button, Card, Typography, PlaceholderPage)
✅ Particle constellation engine + silhouette data
✅ Landing page with 3 animated sections (Hero/Cat, Dog, Bot+Cat)
✅ Fixed navigation bar
✅ App shell with sidebar navigation
✅ 6 placeholder pages
✅ React Router configuration
✅ Responsive layout (mobile stacking, hidden sidebar)
✅ Scroll-triggered Framer Motion animations with staggered children
✅ Smooth scroll + reduced-motion handling

---

## What's NOT Done Yet (Next Steps)

- **Backend** — No API, no database, no auth
- **Placeholder pages** — All 6 app pages are "Coming Soon" stubs. Need real UI for Dashboard, My Pets, AI Chat, Vaccinations, Medical Records, Health Timeline
- **Mobile sidebar** — Currently just hidden on mobile. Needs hamburger menu or drawer
- **Actual auth** — Login/signup buttons navigate directly to `/app/dashboard` without authentication
- **Font: Acronym** — It's a premium font. Currently falling back to Space Grotesk via Google Fonts. If you have Acronym installed locally it'll pick it up via `@font-face { src: local('Acronym') }`
- **Tests** — No test suite yet. Design doc calls for Vitest + React Testing Library
- **Logo** — Using text "PawPal AI" as placeholder. Needs actual SVG logo

---

## Commands

```bash
cd client
npm run dev      # Start dev server (Vite, usually port 5173)
npm run build    # TypeScript check + production build
npm run preview  # Preview production build locally
npm run lint     # ESLint
```

---

## Important Notes for AI Assistants

1. **Tailwind v4** — No `tailwind.config.js`. All config is in `index.css` via `@theme` block. The `@tailwindcss/vite` plugin handles processing.
2. **Path aliases** — `@/` maps to `./src/`. Configured in both `tsconfig.app.json` and `vite.config.ts`.
3. **Single font family** — Everything uses `font-acronym`. No separate display/body fonts.
4. **Dark-only** — No light mode. Everything is on `#000000` void black background.
5. **No component library** — shadcn/ui is initialized but custom components are in `components/ui/`. Don't pull in shadcn default components without checking they match the Dala token system.
6. **React Router v7** — Uses the v6 API (`BrowserRouter`, `Routes`, `Route`). Don't use the new v7 data router APIs unless migrating intentionally.
7. **Framer Motion v12** — Automatically respects `prefers-reduced-motion`. Uses `useInView` for scroll triggers.
