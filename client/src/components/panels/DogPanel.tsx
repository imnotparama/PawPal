import { AmbientShapes } from "@/components/AmbientShapes";

export function DogPanel() {
  return (
    <div className="relative w-full h-full flex items-center justify-end">
      <AmbientShapes seed={29} count={28} />

      {/* Text RIGHT */}
      <div data-panel-content className="relative z-10 pr-12 lg:pr-20 xl:pr-28 max-w-[48%]">
        <h2
          data-reveal data-reveal-delay="0.05"
          className="text-bone"
          style={{
            fontSize: "clamp(48px, 7vw, 96px)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            fontWeight: 300,
          }}
        >
          A vet in
          <br />
          your pocket.
        </h2>

        <div data-reveal data-reveal-delay="0.2" className="mt-10">
          <p
            className="text-plum-voltage"
            style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}
          >
            For every species. Every breed. Every quirk.
          </p>
          <p
            className="mt-4 text-ash max-w-[380px]"
            style={{ fontSize: 15, lineHeight: 1.6, letterSpacing: "0.01em" }}
          >
            Upload a photo of a rash, paste a vet&apos;s report, ask why your
            dog won&apos;t eat. PawPal threads it all into a single, growing
            portrait of your animal.
          </p>
        </div>

        <ul data-reveal data-reveal-delay="0.35" className="mt-8 space-y-3">
          {[
            "Vaccination schedules — auto-tracked.",
            "Symptom triage without the panic.",
            "Weight, mood, appetite — quietly observed.",
          ].map((line) => (
            <li key={line} className="flex items-start gap-3 text-bone" style={{ fontSize: 14, letterSpacing: "0.01em" }}>
              <span className="mt-1.5 block w-1.5 h-1.5 rounded-full bg-plum-voltage shrink-0" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
