import { createFileRoute } from "@tanstack/react-router";
import { ParticleConstellation } from "@/components/ParticleConstellation";
import { AmbientShapes } from "@/components/AmbientShapes";
import { CAT_PATH, DOG_PATH, GIRL_CAT_PATH } from "@/lib/silhouettes";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PawPal AI — Your pet's health, in the constellation" },
      {
        name: "description",
        content:
          "PawPal AI is the smart health companion for your pet. Vaccinations, records, AI chat — answered before you ask.",
      },
      {
        property: "og:title",
        content: "PawPal AI — Your pet's health, in the constellation",
      },
      {
        property: "og:description",
        content:
          "Smart, calm, always-on health companion for cats and dogs. Powered by AI.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main className="min-h-screen bg-void text-bone font-acronym overflow-x-hidden">
      <Nav />
      <Hero />
      <DogSection />
      <GirlCatSection />
      <Footer />
    </main>
  );
}

/* ------------------------------ NAV ------------------------------ */
function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-sm bg-void/60">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10 h-[72px] flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group">
          <LogoMark />
          <span
            className="text-bone"
            style={{ fontWeight: 600, fontSize: 18, letterSpacing: "0.01em" }}
          >
            PawPal<span className="text-plum-voltage">.</span>ai
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-10">
          {["MANIFESTO", "PRODUCT", "PRICING", "BLOG"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="text-smoke hover:text-bone transition-colors"
              style={{ fontSize: 14, letterSpacing: "0.021em", fontWeight: 400 }}
            >
              {l}
            </a>
          ))}
        </nav>

        <a
          href="#request"
          className="inline-flex items-center justify-center rounded-3xl bg-plum-voltage text-bone hover:opacity-90 transition-opacity"
          style={{
            padding: "12px 18px",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          Request access
        </a>
      </div>
    </header>
  );
}

function LogoMark() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M16 3 L29 12 L24 28 L8 28 L3 12 Z"
        stroke="#8052ff"
        strokeWidth="1.5"
      />
      <circle cx="16" cy="17" r="3" fill="#8052ff" />
    </svg>
  );
}

/* ------------------------------ HERO — CAT ------------------------------ */
function Hero() {
  return (
    <section className="relative pt-[140px] pb-[120px] overflow-hidden">
      <AmbientShapes seed={11} count={42} />
      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: text block */}
        <div className="max-w-[520px] pawpal-fade-up relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <span className="block w-1.5 h-1.5 rounded-full bg-plum-voltage pawpal-pulse-dot" />
            <span
              className="text-amber-spark"
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Stop guessing. Start caring.
            </span>
          </div>

          <h1
            className="text-bone"
            style={{
              fontSize: "clamp(56px, 9vw, 113px)",
              lineHeight: 0.85,
              letterSpacing: "-0.04em",
              fontWeight: 200,
            }}
          >
            Your pet's
            <br />
            health,
            <br />
            <span style={{ fontWeight: 300, fontStyle: "italic" }}>
              answered.
            </span>
          </h1>

          <p
            className="mt-10 text-ash max-w-[440px]"
            style={{
              fontSize: 16,
              lineHeight: 1.55,
              letterSpacing: "0.015em",
              fontWeight: 400,
            }}
          >
            PawPal AI quietly listens to every vaccine, every vet note,
            every symptom — and answers the next question before you
            think to ask it.
          </p>

          <div className="mt-12 flex items-center gap-4 flex-wrap">
            <a
              href="/app"
              className="inline-flex items-center justify-center rounded-3xl bg-plum-voltage text-bone hover:opacity-90 transition-opacity"
              style={{
                padding: "16px 22px",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Meet PawPal
            </a>
            <a
              href="#manifesto"
              className="inline-flex items-center justify-center rounded-3xl border border-amber-spark text-amber-spark hover:bg-amber-spark/5 transition-colors"
              style={{
                padding: "16px 22px",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Watch the demo
            </a>
          </div>

          <div className="mt-16 flex items-center gap-8 text-smoke">
            <Stat n="12k+" label="Pets onboarded" />
            <div className="w-px h-10 bg-white/10" />
            <Stat n="98%" label="Owners feel calmer" />
            <div className="w-px h-10 bg-white/10" />
            <Stat n="24/7" label="AI standby" />
          </div>
        </div>

        {/* Right: cat constellation */}
        <div className="relative h-[560px] lg:h-[680px]">
          <ParticleConstellation
            pathD={CAT_PATH}
            count={2600}
            className="absolute inset-0"
            ariaLabel="Constellation in the shape of a sitting cat"
          />
        </div>
      </div>
    </section>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div
        className="text-bone"
        style={{ fontSize: 22, fontWeight: 300, letterSpacing: "-0.02em" }}
      >
        {n}
      </div>
      <div
        className="text-smoke mt-1"
        style={{
          fontSize: 11,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* --------------------------- DOG SECTION --------------------------- */
function DogSection() {
  return (
    <section className="relative py-[120px] border-t border-white/5 overflow-hidden">
      <AmbientShapes seed={29} count={36} />
      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Dog constellation */}
        <div className="relative h-[560px] order-2 lg:order-1">
          <ParticleConstellation
            pathD={DOG_PATH}
            count={2400}
            className="absolute inset-0"
            ariaLabel="Constellation in the shape of a dog"
          />
        </div>

        {/* Copy */}
        <div className="max-w-[520px] order-1 lg:order-2 relative z-10">
          <span
            className="text-plum-voltage"
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            For every species. Every breed. Every quirk.
          </span>
          <h2
            className="mt-6 text-bone"
            style={{
              fontSize: "clamp(40px, 6vw, 78px)",
              lineHeight: 0.92,
              letterSpacing: "-0.04em",
              fontWeight: 200,
            }}
          >
            A vet in
            <br />
            your pocket,
            <br />
            without the
            <br />
            <span className="text-plum-voltage" style={{ fontStyle: "italic" }}>
              waiting room.
            </span>
          </h2>
          <p
            className="mt-10 text-ash"
            style={{ fontSize: 16, lineHeight: 1.55, letterSpacing: "0.015em" }}
          >
            Upload a photo of a rash, paste a vet's report, ask why
            your dog won't eat the kibble he loved yesterday. PawPal
            threads it all into a single, growing portrait of your animal.
          </p>

          <ul className="mt-12 space-y-6">
            {[
              "Vaccination schedules — auto-tracked from your vet PDFs.",
              "Symptom triage that flags emergencies without panicking you.",
              "A timeline of weight, mood, appetite — quietly observed.",
            ].map((line) => (
              <li
                key={line}
                className="flex gap-4 text-bone"
                style={{ fontSize: 15, letterSpacing: "0.02em" }}
              >
                <span className="mt-2 block w-1.5 h-1.5 rounded-full bg-plum-voltage shrink-0" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- GIRL + CAT SECTION --------------------------- */
function GirlCatSection() {
  return (
    <section
      id="request"
      className="relative py-[140px] border-t border-white/5 overflow-hidden"
    >
      <AmbientShapes seed={53} count={44} />
      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative z-10">
            <span
              className="text-amber-spark"
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              The bond is the product.
            </span>
            <h2
              className="mt-6 text-bone"
              style={{
                fontSize: "clamp(40px, 6vw, 78px)",
                lineHeight: 0.92,
                letterSpacing: "-0.04em",
                fontWeight: 200,
              }}
            >
              Hold them
              <br />
              closer, with
              <br />
              <span className="text-plum-voltage" style={{ fontStyle: "italic" }}>
                fewer worries.
              </span>
            </h2>
            <p
              className="mt-10 text-ash max-w-[420px]"
              style={{ fontSize: 16, lineHeight: 1.55 }}
            >
              PawPal's model is grounded in peer-reviewed veterinary
              literature, anonymized clinical histories, and a panel of
              practicing vets — so the time you spend with your pet
              is spent loving them, not Googling them.
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
              <a
                href="/app"
                className="rounded-3xl bg-plum-voltage text-bone"
                style={{
                  padding: "16px 22px",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Create your pet
              </a>
              <a
                href="/app"
                className="rounded-3xl border border-white/15 text-bone hover:bg-white/5 transition-colors"
                style={{
                  padding: "16px 22px",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Sign in
              </a>
            </div>
          </div>

          {/* Girl + Cat constellation */}
          <div className="lg:col-span-7 relative h-[640px]">
            <ParticleConstellation
              pathD={GIRL_CAT_PATH}
              count={2800}
              className="absolute inset-0"
              ariaLabel="Constellation in the shape of a girl holding a cat"
            />
          </div>
        </div>

        {/* Triptych: three calm feature cards on the void */}
        <div className="mt-[120px] grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            kicker="01 / Records"
            title="Every paper. Every scan."
            body="Drop in PDFs, photos, prescriptions. PawPal extracts dates, dosages, diagnoses — no typing."
          />
          <FeatureCard
            kicker="02 / Chat"
            title="Ask anything, anytime."
            body="From 'is chocolate really that bad?' to 'why is she limping?' — answered with citations, not vibes."
          />
          <FeatureCard
            kicker="03 / Timeline"
            title="A quiet, watchful history."
            body="See your pet's life as a soft constellation of weight, mood, meals, and milestones."
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  kicker,
  title,
  body,
}: {
  kicker: string;
  title: string;
  body: string;
}) {
  return (
    <article className="rounded-3xl border border-white/10 p-8 hover:border-plum-voltage/40 transition-colors bg-void/40 backdrop-blur-sm">
      <div
        className="text-plum-voltage"
        style={{
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        {kicker}
      </div>
      <h3
        className="mt-6 text-bone"
        style={{
          fontSize: 26,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          fontWeight: 300,
        }}
      >
        {title}
      </h3>
      <p
        className="mt-4 text-smoke"
        style={{ fontSize: 14, lineHeight: 1.55, letterSpacing: "0.02em" }}
      >
        {body}
      </p>
    </article>
  );
}

/* ------------------------------ FOOTER ------------------------------ */
function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <LogoMark />
          <span
            style={{ fontSize: 14, letterSpacing: "0.021em" }}
            className="text-smoke"
          >
            © 2026 PawPal AI — built quietly, for the loud ones at home.
          </span>
        </div>
        <div className="flex items-center gap-8 text-smoke">
          {["Privacy", "Terms", "Contact"].map((l) => (
            <a
              key={l}
              href="#"
              className="hover:text-bone transition-colors"
              style={{ fontSize: 13, letterSpacing: "0.021em" }}
            >
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
