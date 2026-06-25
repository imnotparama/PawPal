import { AmbientShapes } from "@/components/AmbientShapes";

export function DogPanel() {
  return (
    <div className="relative w-full h-full flex items-center justify-end">
      <AmbientShapes seed={29} count={40} />
      <div className="absolute left-0 top-[10%] bottom-[10%] w-px bg-white/5" />

      <div data-panel-content className="relative max-w-[500px] pr-10 lg:pr-20 z-10">
        <span data-reveal data-reveal-delay="0" className="text-plum-voltage" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          For every species. Every breed. Every quirk.
        </span>

        <h2 data-reveal data-reveal-delay="0.1" className="mt-6 text-bone" style={{ fontSize: "clamp(36px, 5vw, 68px)", lineHeight: 0.92, letterSpacing: "-0.04em", fontWeight: 200 }}>
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
  );
}
