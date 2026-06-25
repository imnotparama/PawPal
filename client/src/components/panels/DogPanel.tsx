import { AmbientShapes } from "@/components/AmbientShapes";
import { ParticleConstellation } from "@/components/ParticleConstellation";
import { DOG_PATH } from "@/lib/silhouettes";

export function DogPanel() {
  return (
    <div className="relative w-full h-full flex items-center justify-end">
      <AmbientShapes seed={29} count={40} />
      <div className="absolute left-0 top-[10%] bottom-[10%] w-px bg-white/5" />

      {/* Constellation LEFT */}
      <div className="absolute left-[5%] top-[10%] bottom-[10%] w-[45%] dala-constellation-wrap">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none constellation-glow" />
        <ParticleConstellation
          pathD={DOG_PATH}
          count={2400}
          className="absolute inset-0 dala-constellation-surface"
          ariaLabel="Dog constellation"
        />
      </div>

      {/* Text RIGHT */}
      <div data-panel-content className="relative z-10 pr-12 lg:pr-24 xl:pr-32 max-w-[48%]">
        <div className="max-w-[460px]">
          <span data-reveal data-reveal-delay="0" className="text-plum-voltage" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            For every species. Every breed. Every quirk.
          </span>

          <h2 data-reveal data-reveal-delay="0.1" className="mt-6 text-bone" style={{ fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 0.92, letterSpacing: "-0.04em", fontWeight: 200 }}>
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

          <p data-reveal data-reveal-delay="0.25" className="mt-8 text-ash" style={{ fontSize: 15, lineHeight: 1.55, letterSpacing: "0.015em" }}>
            Upload a photo of a rash, paste a vet&apos;s report, ask why your
            dog won&apos;t eat the kibble he loved yesterday. PawPal threads it
            all into a single, growing portrait of your animal.
          </p>

          <ul data-reveal data-reveal-delay="0.4" className="mt-10 space-y-5">
            {[
              "Vaccination schedules — auto-tracked from vet PDFs.",
              "Symptom triage that flags emergencies without panicking you.",
              "A timeline of weight, mood, appetite — quietly observed.",
            ].map((line) => (
              <li key={line} className="dala-list-item flex gap-3 text-bone" style={{ fontSize: 14, letterSpacing: "0.02em" }}>
                <span className="dala-list-dot mt-2 block w-1.5 h-1.5 rounded-full bg-plum-voltage shrink-0" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
