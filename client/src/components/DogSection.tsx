import { ParticleConstellation } from "@/components/ParticleConstellation";
import { AmbientShapes } from "@/components/AmbientShapes";
import { DOG_PATH } from "@/lib/silhouettes";

export function DogSection() {
  return (
    <section className="relative py-[120px] border-t border-white/5 overflow-hidden">
      <AmbientShapes seed={29} count={36} />
      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative h-[560px] order-2 lg:order-1 dala-constellation-wrap">
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none constellation-glow"
          />
          <ParticleConstellation
            pathD={DOG_PATH}
            count={2400}
            className="absolute inset-0 dala-constellation-surface"
            ariaLabel="Constellation in the shape of a dog"
          />
        </div>

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
            Upload a photo of a rash, paste a vet&apos;s report, ask why your
            dog won&apos;t eat the kibble he loved yesterday. PawPal threads it
            all into a single, growing portrait of your animal.
          </p>

          <ul className="mt-12 space-y-6">
            {[
              "Vaccination schedules — auto-tracked from your vet PDFs.",
              "Symptom triage that flags emergencies without panicking you.",
              "A timeline of weight, mood, appetite — quietly observed.",
            ].map((line) => (
              <li
                key={line}
                className="dala-list-item flex gap-4 text-bone"
                style={{ fontSize: 15, letterSpacing: "0.02em" }}
              >
                <span
                  className="dala-list-dot mt-2 block w-1.5 h-1.5 rounded-full bg-plum-voltage shrink-0"
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
