# 🐾 PawPal AI — Your Pet's Smart Health Companion

> A premium AI-powered pet health platform with a 3D particle-morph 
> landing experience, real-time vet triage, and full health record management.


**Live Demo**: [https://pawpal-wheat.vercel.app]  
**Demo Video**: [YouTube/Loom link]  
**Built by**: Parameshwaran S

---

## 🎯 What Problem Does This Solve?

Pet owners face three universal problems:
1. **Panic googling** — "Why is my dog scratching his ears?" returns 
   50 contradictory results and WebMD-level anxiety
2. **Forgotten vaccinations** — Most owners don't track due dates 
   until a vet asks at the next visit
3. **Scattered records** — Vet notes live in physical folders, 
   WhatsApp messages, and email attachments

**PawPal AI solves all three** in one beautiful, AI-powered platform.

---

## 🌟 Key Features

### 🌌 3D Particle Morph Landing Page
- 6,000 instanced Three.js triangles rendered with custom GLSL 
  vertex + fragment shaders
- Particles morph in real-time between three silhouettes 
  (Cat → Dog → Girl-with-Cat) as users scroll through 4 horizontal panels
- ACES Filmic Tone Mapping, per-instance rotation, 
  position-based color gradients (amber → white → plum violet)
- Mouse parallax tracking and scroll-driven explosion effect on final panel
- 60 FPS target maintained via instanced rendering — 
  drawing 6,000 shapes as a single GPU draw call

### 🤖 AI Pet Health Triage (Google Gemini)
- Real-time symptom triage powered by Gemini 1.5 Flash
- **Multimodal Image Analysis**: Attach a photo of rashes, wounds, eye concerns, or food labels via the attachment clip button for direct visual symptom diagnosis.
- **Voice-to-text input** via Web Speech Recognition API — 
  describe symptoms hands-free
- **Selected Pet History Filter**: Dropdown above the chat history window allowing instant message-history filtering dynamically synced to specific pet IDs.
- Structured Markdown responses with code blocks, headers, bold formatting, and actionable advice
- Full chat history persisted per pet in Supabase
- Gemini API key never exposed to client — 
  routed through TanStack Start Server Action on Vercel serverless

### 📊 Complete Health Management
- **Pet Profiles** — Photo uploads with client-side canvas compression before storage upload, Zod form validation, and real-time toast feedback
- **Life Phase Advisor** — Dynamic care assessment that calculates your cat's exact growth/maturity stage (from Kitten infancy to Geriatric) to suggest target nutrition and medical focus.
- **Printable Health Passport** — Clean print layouts with specialized document IDs, profile pictures, and mock QR verification stamps to easily print/export records for boarding facilities or vets.
- **Vaccination Tracker** — Upcoming/Completed/Overdue status, 
  urgency indicators with pulsing alerts for near-due dates
- **Medical Records** — File upload (PDF/images), 
  typed by Checkup/Surgery/Treatment/Consultation with color coding
- **Health Timeline** — Auto-generated chronological view 
  merging all health events across all pets
- **Health Score** — Dynamic calculation based on vaccination 
  compliance (vaccines_completed / expected_vaccinations * 100) and recent activity with a prominent 78px typography arc display on the main dashboard.
- **My Profile Settings** — Full account personalization workspace. Includes canvas-based image compression for user avatar uploads to Supabase storage, metadata editing for display name/username, location, phone, favorite pet type selection, and focus area priorities, which dynamically sync with the navigation sidebar user badge.

### 💎 Premium UX Details
- **Cat Purr Sound Therapy Widget**: Calming synthesizer using Web Audio API low-frequency oscillators (sine + triangle waves) modulated by breathing cycle gains (~0.18 Hz frequency) to simulate standard cat purring, complete with a custom neon canvas vibration visualizer.
- Magnetic buttons with spring-physics hover effect
- CometCard 3D tilt on pet profile cards (Framer Motion)
- Staggered page-load animations across all dashboard widgets
- Glassmorphic empty states with onboarding checklists
- Real-time health alerts when vaccinations are overdue
- Stale-While-Revalidate caching for instant navigation
- Developer info modal with glassmorphic overlay
- Custom cursor glow effect tied to mouse position
- **Global Error Boundary & Fallback**: Standardized graceful error handling across router views to prevent blank screens on client crashes.
- **Help & Support Hub**: Comprehensive interface containing search filtering, interactive accordion FAQ entries, and developer contact forms.
- **Secure Account Actions**: A Radix UI confirmation AlertDialog wrapper for permanent account deletion triggers.

---

## 🏗️ Architecture
```
┌─────────────────────────────────────────────────────┐
│                   Browser Client                    │
│ React 19 + TanStack Router + Framer Motion + Three.js│
└────────────────────────┬────────────────────────────┘
                         │ SSR Route Requests
                         ▼
┌─────────────────────────────────────────────────────┐
│               Vercel Serverless (SSR)               │
│            TanStack Start + Nitro Preset            │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │           Server Action: chat.ts            │  │
│  │        Privately fetches Gemini API         │  │
│  │       API key NEVER sent to browser         │  │
│  └─────────────────────────────────────────────┘  │
└────┬──────────────────────────┬───────────────────┘
     │                          │
     ▼                          ▼
┌──────────────┐      ┌─────────────────────┐
│   Supabase   │      │  Google Gemini API  │
│              │      │  gemini-1.5-flash   │
│ • Auth (JWT) │      │  Pet health triage  │
│ • Postgres   │      └─────────────────────┘
│  - pets      │
│  - vacc.     │
│  - records   │
│  - chat_msg  │
│ • Storage    │
│  - photos    │
│  - files     │
│ • RLS on ALL │
└──────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | TanStack Start + React 19 | SSR + file-based routing |
| Build | Vite 8 | Fastest HMR, ESM-first |
| Styling | Tailwind CSS v4 | Zero-runtime CSS |
| 3D | Three.js + custom GLSL | GPU-instanced particle morph |
| Animation | Framer Motion v12 | Spring physics + layout animations |
| Components | shadcn/ui + Radix UI | Accessible primitives |
| Database | Supabase Postgres | RLS, realtime, storage |
| Auth | Supabase Auth | JWT + email/password |
| AI | Google Gemini 1.5 Flash | Fast, accurate pet health triage |
| Deployment | Vercel (Nitro preset) | SSR serverless edge |

---

## 🔐 Security

### API Key Protection
The Gemini API key is **never exposed to the browser**.
All AI requests are proxied through a TanStack Start 
Server Action (`src/utils/chat.ts`) which runs exclusively 
on Vercel's serverless infrastructure.
```
Browser → POST /api/chat (no key)
        → Vercel Server Action (key lives here only)
        → Gemini API
        → Response back to browser
```

### Database Security
Every table is protected by Supabase Row Level Security:

```sql
-- Users can ONLY access their own data
create policy "own pets" on pets 
  for all using (auth.uid() = user_id);

create policy "own vaccinations" on vaccinations 
  for all using (auth.uid() = user_id);

create policy "own records" on medical_records 
  for all using (auth.uid() = user_id);

create policy "own messages" on chat_messages 
  for all using (auth.uid() = user_id);
```

### Additional Measures
- `.env` in `.gitignore` — zero secrets in repo
- Input sanitization on all user inputs before DB writes
- File uploads scoped to `{user_id}/` paths in Supabase Storage
- CSP headers on all server response paths
- Password minimum enforcement on signup
- Rate limiting on AI chat (1 message per 2 seconds)

> 📎 **Security Audit & Triage Report**: [Aikido Security Scan Report (PDF)](https://drive.google.com/file/d/1nheg4vK91LAIj0XFDHxqvAWX50kCO2sc/view?usp=sharing) — PawPal AI is audited and verified clean of all security vulnerabilities (including path traversals and generative key exposures).

---

## 🗄️ Database Schema

```sql
-- Core tables (all with RLS enabled)

pets (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  name text, species text, breed text,
  age_years int, weight_kg decimal,
  photo_url text, health_status text,
  created_at timestamptz
)

vaccinations (
  id uuid PRIMARY KEY,
  user_id uuid, pet_id uuid REFERENCES pets,
  vaccine_name text, date date,
  status text, notes text
)

medical_records (
  id uuid PRIMARY KEY,
  user_id uuid, pet_id uuid REFERENCES pets,
  title text, record_type text,
  doctor_name text, clinic_name text,
  date date, notes text, file_url text
)

chat_messages (
  id uuid PRIMARY KEY,
  user_id uuid, pet_id uuid REFERENCES pets,
  role text CHECK (role IN ('user','assistant')),
  content text, created_at timestamptz
)

-- Auto-generated view merging all health events
health_timeline VIEW (
  union of vaccinations + medical_records
  ordered by date desc
)
```

---

## ⚡ Performance

- **Single GPU draw call** for all 6,000 particles 
  (THREE.InstancedMesh)
- **SSR** — first paint is server-rendered HTML, 
  not a blank loading screen
- **Stale-While-Revalidate** caching — 
  dashboard data loads instantly from localStorage, 
  then revalidates in background
- **Reduced motion** support — particle count halved 
  and animations disabled for 
  `prefers-reduced-motion: reduce` users
- Mobile performance guard — devicePixelRatio capped at 1 
  on screens under 767px

---

## 🚀 Setup

### Prerequisites
- Node.js v18+ or Bun
- Supabase project (free tier works)
- Google Gemini API key (free tier works)

### Local Development

```bash
# 0. Clone
git clone https://github.com/imnotparama/PawPal.git
cd PawPal

# 1. Install
npm install

# 2. Environment
cp .env.example .env
# Fill in your keys:
# VITE_SUPABASE_URL=
# VITE_SUPABASE_ANON_KEY=
# GEMINI_API_KEY=  ← server-side only, no VITE_ prefix

# 3. Run Supabase schema
# Copy contents of /docs/schema.sql
# Paste into Supabase SQL editor and run

# 4. Start
npm run dev
# → http://localhost:8080
```

### Vercel Deployment

```bash
# Build command
NITRO_PRESET=vercel npm run build

# Environment variables to add in Vercel dashboard:
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
GEMINI_API_KEY=
```

---

## 📁 Project Structure
```
PawPal/
├── src/
│   ├── routes/          # File-based TanStack Router pages
│   │   ├── index.tsx    # Landing page (4 horizontal panels)
│   │   ├── auth/        # Sign in / Sign up
│   │   └── dashboard/   # App pages
│   │       ├── index.tsx
│   │       ├── pets/
│   │       ├── chat/
│   │       ├── vaccinations/
│   │       ├── records/
│   │       └── timeline/
│   ├── components/
│   │   ├── ParticleMorph3D.tsx # Three.js 6k particle system
│   │   ├── panels/      # Landing page sections
│   │   ├── ui/          # shadcn + custom components
│   │   └── AppLayout.tsx # Dashboard sidebar layout
│   ├── hooks/           # usePets, useVaccinations, etc.
│   ├── lib/
│   │   ├── supabase.ts  # Supabase client
│   │   ├── silhouettes.ts # SVG paths for particle morphing
│   │   └── particles.ts  # 2D canvas particle engine
│   └── utils/
│       └── chat.ts      # Server Action — Gemini proxy
├── docs/
│   └── schema.sql       # Full Supabase schema
├── .env.example
└── README.md
```

---

## ⚡ Scalability & Capacity Analysis

PawPal AI is architected with modern serverless computing, edge database query caching, and client-side media optimization, enabling the application to scale efficiently from a hackathon prototype to a global production service.

### 📊 Capacity Comparison Tiers

| Metric | Free Tier (Hackathon Setup) | Pro Tier (Production Scaling) |
|:---|:---|:---|
| **Authentication** | 50,000 MAU | **Unlimited (100,000+ MAU included)** |
| **Database Space** | 500 MB PostgreSQL | **~160,000 Active Users** *(8 GB included)* |
| **File Storage** | 1 GB Storage Bucket | **~830,000 Users** *(100 GB included)* |
| **Client Media Compression** | Resized and Canvas-compressed to ~29-50KB before upload | **Massive bandwidth & hosting cost savings** |
| **Edge Serverless Hosting** | 99 GB monthly bandwidth | **1 TB+ monthly bandwidth (150k+ visitors)** |
| **AI Chat capacity** | 15 Gemini requests per minute | **10,000+ concurrent prompts per minute** |

*Under the free plan, the application comfortably supports **~10,000 to 20,000 fully active users** at zero monthly cost due to RLS data isolation and client-side Canvas optimization.*

---

## 🎨 Design System

Inspired by the Dala design language:

| Token | Value | Usage |
|---|---|---|
| Void | `#000000` | Page background |
| Bone | `#ffffff` | Primary text |
| Ash | `#bdbdbd` | Secondary text |
| Plum Voltage | `#8052ff` | Primary accent, buttons, glows |
| Amber Spark | `#ffb829` | Warning states, particle tops |
| Lichen | `#15846e` | Success states, particle accents |

- **Border radius**: 24px on all interactive elements
- **Font**: Space Grotesk (200–700 weights)
- **Elevation**: Zero shadows — depth from color contrast only
- **Motion**: Framer Motion springs, stagger reveals, 
  magnetic hover effects

---

## 👨‍💻 Built By

**Parameshwaran S**  
GitHub:[@imnotparama](https://github.com/imnotparama)  
LinkedIn:[@Parameshwaran S](https://www.linkedin.com/in/parameshwaran-s-datascientist/)

*Built for Hack the Kitty Hackathon 2026*

---

## 📄 License
MIT
