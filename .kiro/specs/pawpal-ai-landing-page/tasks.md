# Implementation Plan: PawPal AI Landing Page

## Overview

Build a visually striking dark cosmic landing page and app shell for PawPal AI using Vite + React 18 + TypeScript + Tailwind CSS v4 + Framer Motion. The implementation proceeds from project scaffolding through design tokens, base components, the particle system engine, landing page sections, and finally the app shell with placeholder pages. All visual elements follow the Dala Design System tokens.

## Tasks

- [x] 1. Project scaffolding and dependency installation
  - [x] 1.1 Initialize Vite project with React 18 + TypeScript template
    - Run `npm create vite@latest client -- --template react-ts`
    - Verify the dev server starts and renders the default page
    - _Requirements: 10.1_

  - [x] 1.2 Install core dependencies
    - Install Tailwind CSS v4, React Router v6, Framer Motion, lucide-react
    - Install shadcn/ui CLI and initialize with dark theme defaults
    - Install `clsx` and `tailwind-merge` for the `cn()` utility
    - _Requirements: 10.2, 10.3, 10.4, 10.6_

  - [x] 1.3 Set up directory structure
    - Create `/client/src/components/ui/`, `/client/src/components/`, `/client/src/pages/`, `/client/src/lib/`, `/client/src/styles/`, `/client/src/assets/`
    - Create `lib/utils.ts` with `cn()` helper function
    - _Requirements: 10.5_

- [x] 2. Design tokens and Tailwind CSS v4 configuration
  - [x] 2.1 Configure Tailwind CSS v4 with Dala Design System tokens
    - Create `/client/src/index.css` with Tailwind directives (`@import "tailwindcss"`)
    - Add `@theme` block defining all Dala colors: void-black (#000000), plum-voltage (#8052ff), amber-spark (#ffb829), lichen (#15846e), text-primary (#ffffff), text-secondary (#bdbdbd), text-tertiary (#9a9a9a), border-hairline (rgba(255,255,255,0.1))
    - Add spacing tokens: section-gap (60px), card-padding (24px), element-gap (15px), page-max-width (1200px), sidebar-width (220px)
    - Add border-radius token: interactive (24px)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.8, 6.9, 6.10_

  - [x] 2.2 Configure fonts
    - Create `/client/src/styles/fonts.css` with Google Fonts import for Space Grotesk and Inter
    - Import fonts.css in main entry point
    - Add font-family tokens to the `@theme` block: display (Space Grotesk), body (Inter)
    - _Requirements: 6.7_

- [x] 3. Reusable base components
  - [x] 3.1 Implement Button component
    - Create `/client/src/components/ui/Button.tsx`
    - Implement three variants: `primary` (bg-plum-voltage, text-white, rounded-3xl), `outline` (border-2 border-amber-spark, text-amber-spark, rounded-3xl, bg-transparent), `ghost` (text-tertiary, hover:text-white, bg-transparent)
    - Implement three sizes: `sm`, `md`, `lg` with appropriate padding
    - Apply 24px border radius on all variants
    - _Requirements: 6.3, 6.4, 6.6_

  - [x] 3.2 Implement Card component
    - Create `/client/src/components/ui/Card.tsx`
    - Base style: bg-transparent, border border-white/10, rounded-3xl, p-6
    - Enforce no shadow, no gradient, no elevation
    - _Requirements: 6.6, 6.8, 6.9_

  - [x] 3.3 Implement Typography component
    - Create `/client/src/components/ui/Typography.tsx`
    - Implement variants: `display` (Space Grotesk, 78px, weight 200, tracking -0.04em, white), `headline` (Space Grotesk, 48px, weight 200, tracking -0.04em, white), `body` (Inter, 16px, weight 400, tracking +0.025em, #bdbdbd, leading-relaxed), `eyebrow` (Inter, 13px, weight 500, uppercase, tracking +0.05em, #bdbdbd), `caption` (Inter, 14px, weight 400, #9a9a9a)
    - Support configurable `as` prop for semantic HTML element
    - _Requirements: 6.7, 2.3, 2.4_

- [x] 4. Checkpoint - Verify base components
  - Ensure project builds without errors
  - Ensure all three base components render correctly
  - Ask the user if questions arise.

- [x] 5. Particle constellation engine
  - [x] 5.1 Implement particle system core logic
    - Create `/client/src/lib/particles.ts`
    - Define `Particle` interface with x, y, baseX, baseY, size, shape, color, vx, vy, opacity, phase fields
    - Define `SilhouetteMask` interface with name, points (normalized 0-1 polygon vertices), width, height
    - Implement `spawnParticles(mask, count, canvasWidth, canvasHeight)` — generate random particles within the mask polygon using point-in-polygon test
    - Implement `updateParticle(particle, time)` — sinusoidal drift around baseX/baseY
    - Implement `drawParticle(ctx, particle)` — draw triangle/circle/diamond based on shape field
    - Implement `pointInPolygon(x, y, polygon)` — ray-casting algorithm for spawn constraint
    - Cap particle count at 2000 maximum
    - _Requirements: 5.1, 5.2, 5.4, 5.6_

  - [x] 5.2 Implement ParticleConstellation React component
    - Create `/client/src/components/ParticleConstellation.tsx`
    - Accept props: `silhouette`, `particleCount` (default 1200), `className`, `animate`
    - On mount: create canvas, compute dimensions, scale silhouette mask, spawn particles
    - Start `requestAnimationFrame` loop: clear canvas, update all particles, draw all particles
    - Use `devicePixelRatio` for retina rendering
    - Implement `IntersectionObserver` to pause animation when off-screen
    - Implement `prefers-reduced-motion` media query detection — show static frame when active
    - Debounce resize handler (150ms) to recalculate particle positions on container resize
    - _Requirements: 5.1, 5.3, 5.4, 5.6_

  - [x] 5.3 Implement scroll-triggered entrance animation
    - Use Framer Motion `useInView` hook on the wrapper div
    - On entering viewport: fade particles from opacity 0 to target over 800ms
    - Particles start scattered and lerp toward silhouette positions over 1200ms
    - _Requirements: 5.5, 5.3_

- [x] 6. Silhouette mask data
  - [x] 6.1 Create silhouette coordinate data
    - Create `/client/src/lib/silhouettes.ts`
    - Define `CAT_SILHOUETTE` — normalized polygon (~40-60 vertices) forming a recognizable cat outline with ears, head, body, tail
    - Define `DOG_SILHOUETTE` — normalized polygon (~50-70 vertices) forming a dog outline with floppy ears, snout, body, tail
    - Define `BOT_CAT_SILHOUETTE` — composite mask with AI bot (rectangular head, antenna) alongside a small cat shape
    - Export all three as `SilhouetteMask` typed constants
    - _Requirements: 5.4, 2.1, 3.1, 4.1_

- [x] 7. Navigation component
  - [x] 7.1 Implement fixed navigation bar
    - Create `/client/src/components/Navigation.tsx`
    - Position fixed, top-0, full width, z-50
    - Background void-black with bottom hairline border (1px solid white/10)
    - Left: PawPal AI logo (text fallback initially)
    - Center-right: FEATURES, ABOUT, CONTACT links — uppercase, weight 600, 13px, tracking +0.05em, color text-tertiary, hover:text-white transition 200ms
    - Far right: "GET STARTED" CTA_Button with variant="primary"
    - Max-width 1200px container centered with px-6 horizontal padding, h-16 height
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 8. Hero section (cat constellation)
  - [x] 8.1 Implement HeroSection component
    - Create `/client/src/components/HeroSection.tsx`
    - Layout: min-h-screen, CSS grid with 2 columns (stacks on mobile below 768px)
    - Left column: eyebrow text (Typography variant="eyebrow") + display headline (Typography variant="display", 78px desktop) + body text (Typography variant="body", max-w-[480px]) + primary CTA_Button
    - Right column: `<ParticleConstellation silhouette={CAT_SILHOUETTE} />`
    - Apply Framer Motion entrance animation (fade + slide-up) to text elements
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

- [x] 9. Dog section
  - [x] 9.1 Implement DogSection component
    - Create `/client/src/components/DogSection.tsx`
    - Layout: centered, max-w-[1200px], py-[60px] vertical padding
    - ParticleConstellation with dog silhouette, centered, max-w-[600px]
    - Display headline about dog health + AI care
    - Body text explaining AI symptom detection
    - Apply Framer Motion entrance animation triggered on scroll into view
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 10. Bot + cat section with auth CTA
  - [x] 10.1 Implement BotCatSection component
    - Create `/client/src/components/BotCatSection.tsx`
    - Layout: centered, max-w-[1200px], py-[60px] vertical padding
    - ParticleConstellation with bot-cat composite silhouette
    - Display headline about AI-powered pet care
    - Two CTA buttons: "LOG IN" (variant="outline", amber-spark border) + "SIGN UP" (variant="primary", plum-voltage fill)
    - Both buttons navigate to `/app/dashboard`
    - Apply Framer Motion entrance animation
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 11. Checkpoint - Landing page sections complete
  - Ensure all three sections render correctly on the landing page
  - Verify particle constellations animate and form recognizable silhouettes
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. App shell and sidebar
  - [x] 12.1 Implement Sidebar component
    - Create `/client/src/components/Sidebar.tsx`
    - Fixed left position, width 220px, full height, bg-black, right border border-white/10
    - PawPal AI logo at top with 24px padding
    - Navigation items: Dashboard, My Pets, AI Chat, Vaccinations, Medical Records, Health Timeline
    - Each item uses Lucide icons (LayoutDashboard, PawPrint, MessageCircle, Syringe, FileText, Clock)
    - Item styling: 14px, weight 500, color text-tertiary, rounded-3xl padding
    - Active item: bg-plum-voltage/10, text-plum-voltage — determined via `useLocation()` matching current path
    - Hover: text-white transition 200ms
    - _Requirements: 7.1, 7.2, 7.5_

  - [x] 12.2 Implement AppShell layout component
    - Create `/client/src/components/AppShell.tsx`
    - Layout: flex min-h-screen
    - Sidebar on the left (fixed, 220px)
    - Main content area: flex-1, ml-[220px], p-8
    - Render `<Outlet />` from React Router for nested route content
    - Maintain dark theme consistent with landing page
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 13. Placeholder pages
  - [x] 13.1 Create reusable PlaceholderPage component
    - Create `/client/src/components/ui/PlaceholderPage.tsx`
    - Accept `title` and `description` props
    - Render title with Typography variant="headline" (48px, weight 200)
    - Render description with Typography variant="body"
    - Include a decorative Card with dashed border (border-dashed border-white/20) containing "Coming Soon" message
    - _Requirements: 8.7_

  - [x] 13.2 Create all six placeholder pages
    - Create `/client/src/pages/Dashboard.tsx` — title: "Dashboard", description about pet health overview
    - Create `/client/src/pages/MyPets.tsx` — title: "My Pets", description about managing pet profiles
    - Create `/client/src/pages/AIChat.tsx` — title: "AI Chat", description about AI veterinary assistant
    - Create `/client/src/pages/Vaccinations.tsx` — title: "Vaccinations", description about vaccination schedules
    - Create `/client/src/pages/MedicalRecords.tsx` — title: "Medical Records", description about health records
    - Create `/client/src/pages/HealthTimeline.tsx` — title: "Health Timeline", description about pet health history
    - Each page wraps PlaceholderPage with appropriate props
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [x] 14. Landing page assembly
  - [x] 14.1 Create LandingPage route component
    - Create `/client/src/pages/LandingPage.tsx`
    - Compose: Navigation + HeroSection + DogSection + BotCatSection in vertical sequence
    - Full-bleed sections on void-black background
    - _Requirements: 9.1, 9.5_

- [x] 15. Routing configuration
  - [x] 15.1 Configure React Router v6 in App.tsx
    - Create `/client/src/App.tsx` with `createBrowserRouter` or `BrowserRouter`
    - Route `/` renders LandingPage component
    - Route `/app` renders AppShell component with nested children:
      - `/app/dashboard` renders Dashboard
      - `/app/pets` renders MyPets
      - `/app/chat` renders AIChat
      - `/app/vaccinations` renders Vaccinations
      - `/app/records` renders MedicalRecords
      - `/app/timeline` renders HealthTimeline
      - Index route redirects to `/app/dashboard` via `<Navigate replace />`
    - Unknown routes redirect to `/`
    - _Requirements: 7.3, 7.4, 10.3_

  - [x] 15.2 Wire main.tsx entry point
    - Update `/client/src/main.tsx` to import App component and render with React.StrictMode
    - Import `index.css` and `styles/fonts.css`
    - _Requirements: 10.1_

- [x] 16. Responsive layout adjustments
  - [x] 16.1 Implement responsive breakpoints
    - Hero section: stack to single column below 768px (particle below text)
    - Dog section: particle above text on mobile
    - Bot+Cat section: particle above text on mobile, buttons stack vertically
    - Navigation: collapse nav links to hamburger or hide on mobile (simplified for hackathon)
    - Sidebar: hidden on mobile with overlay toggle (or full-width on small screens)
    - Headline display text: 78px desktop to 48px mobile
    - Enforce min-width behavior below 320px
    - Hero section: switch from min-h-screen to min-h-[500px] when viewport height < 500px
    - _Requirements: 9.3, 9.2_

- [x] 17. Scroll animations and entrance effects
  - [x] 17.1 Add Framer Motion scroll-triggered transitions
    - Wrap each landing page section in a Framer Motion `motion.div` with `useInView`
    - Entrance animation: fade in (opacity 0 to 1) + slide up (translateY 40px to 0) over 600ms with easeOut
    - Stagger child elements within each section by 100-150ms
    - Smooth scroll behavior on the page (CSS `scroll-behavior: smooth` or Framer Motion `useScroll`)
    - Ensure reduced-motion users see no animation (instant display)
    - _Requirements: 9.4, 5.5, 5.3_

- [x] 18. Final checkpoint - Full integration verification
  - Ensure the full application builds and runs without errors
  - Verify landing page scrolls through all three sections with particle animations
  - Verify app shell navigation works between all six placeholder pages
  - Verify responsive layout at 768px and 320px widths
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- No property-based tests are included — PBT is not applicable for this UI rendering feature (see design Testing Strategy section)
- All visual correctness is verified through manual testing and snapshot tests
- Tasks are ordered so each step builds on the previous without orphaned code
- The particle system (tasks 5-6) is the most complex piece — allow extra time for tuning silhouette coordinates
- Checkpoints at tasks 4, 11, and 18 provide natural breakpoints for review
