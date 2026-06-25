import { Link } from "react-router-dom";
import { ParticleConstellation } from "@/components/ParticleConstellation";
import { AmbientShapes } from "@/components/AmbientShapes";
import { TiltCard } from "@/components/TiltCard";
import { MagneticButton } from "@/components/MagneticButton";
import { GIRL_CAT_PATH } from "@/lib/silhouettes";

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
    <TiltCard className="dala-card rounded-3xl p-8 bg-void/40 backdrop-blur-sm">
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
    </TiltCard>
  );
}

export function GirlCatSection() {
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
              PawPal&apos;s model is grounded in peer-reviewed veterinary
              literature, anonymized clinical histories, and a panel of
              practicing vets — so the time you spend with your pet is spent
              loving them, not Googling them.
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
              <MagneticButton strength={0.25}>
                <Link
                  to="/app"
                  className="dala-btn-primary glow-btn rounded-3xl"
                  style={{
                    padding: "16px 22px",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  Create your pet
                </Link>
              </MagneticButton>
              <MagneticButton strength={0.2}>
                <Link
                  to="/app"
                  className="dala-btn-ghost rounded-3xl"
                  style={{
                    padding: "16px 22px",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  Sign in
                </Link>
              </MagneticButton>
            </div>
          </div>

          <div className="lg:col-span-7 relative h-[640px] dala-constellation-wrap">
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none constellation-glow"
            />
            <ParticleConstellation
              pathD={GIRL_CAT_PATH}
              count={2800}
              className="absolute inset-0 dala-constellation-surface"
              ariaLabel="Constellation in the shape of a girl holding a cat"
            />
          </div>
        </div>

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
