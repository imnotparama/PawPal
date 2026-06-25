import { AmbientShapes } from "@/components/AmbientShapes";

export function GirlCatPanel() {
  return (
    <div className="relative w-full h-full flex items-center">
      <AmbientShapes seed={53} count={32} />

      {/* Text LEFT */}
      <div data-panel-content className="relative z-10 pl-12 lg:pl-20 xl:pl-28 max-w-[48%]">
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
          Hold them
          <br />
          closer.
        </h2>

        <div data-reveal data-reveal-delay="0.2" className="mt-10">
          <p
            className="text-amber-spark"
            style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}
          >
            The bond is the product.
          </p>
          <p
            className="mt-4 text-ash max-w-[380px]"
            style={{ fontSize: 15, lineHeight: 1.6, letterSpacing: "0.01em" }}
          >
            Grounded in peer-reviewed veterinary literature and a panel of
            practicing vets — so the time you spend with your pet is spent
            loving them, not Googling them.
          </p>
        </div>

        <div data-reveal data-reveal-delay="0.35" className="mt-8 flex gap-6">
          {[
            { n: "12k+", label: "Pets onboarded" },
            { n: "98%", label: "Owners calmer" },
            { n: "24/7", label: "AI standby" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-bone" style={{ fontSize: 22, fontWeight: 300, letterSpacing: "-0.02em" }}>{stat.n}</div>
              <div className="text-smoke mt-1" style={{ fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
