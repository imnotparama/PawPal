import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/timeline")({
  component: TimelinePage,
});

const events = [
  {
    date: "Jun 12, 2025",
    title: "Annual Checkup",
    pet: "Max",
    description: "All vitals normal. Health score improved to 92%.",
    type: "checkup",
  },
  {
    date: "May 28, 2025",
    title: "Ear Infection Detected",
    pet: "Max",
    description: "Brown discharge noted. Treatment started with Otomax drops.",
    type: "concern",
  },
  {
    date: "May 22, 2025",
    title: "Bordetella Vaccine",
    pet: "Max",
    description: "Routine vaccination completed. No adverse reactions.",
    type: "vaccine",
  },
  {
    date: "Apr 15, 2025",
    title: "Spay Surgery",
    pet: "Luna",
    description: "Successful procedure. Full recovery by Apr 25.",
    type: "procedure",
  },
  {
    date: "Mar 3, 2025",
    title: "New Pet Added",
    pet: "Milo",
    description: "Milo joined the family! First wellness visit completed.",
    type: "milestone",
  },
  {
    date: "Feb 10, 2025",
    title: "Allergy Consultation",
    pet: "Max",
    description: "Started on Apoquel for environmental allergies.",
    type: "concern",
  },
];

const typeColors: Record<string, string> = {
  checkup: "bg-lichen",
  concern: "bg-amber-spark",
  vaccine: "bg-plum-voltage",
  procedure: "bg-plum-voltage",
  milestone: "bg-lichen",
};

function TimelinePage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-heading font-semibold mb-2">Health Timeline</h1>
      <p className="text-smoke mb-8">
        A chronological view of health events across all your pets.
      </p>

      {/* Vertical Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[11px] top-0 bottom-0 w-px bg-white/10" />

        <div className="space-y-6">
          {events.map((event, i) => (
            <div key={i} className="flex gap-4">
              {/* Dot */}
              <div className="relative z-10 mt-1.5">
                <div
                  className={`w-[22px] h-[22px] rounded-full border-2 border-void ${typeColors[event.type] || "bg-smoke"}`}
                />
              </div>

              {/* Content */}
              <div className="border border-white/10 rounded-3xl p-5 flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-bone font-semibold text-sm">
                    {event.title}
                  </h3>
                  <span className="text-smoke text-xs">{event.date}</span>
                </div>
                <p className="text-plum-voltage text-xs font-medium mb-1">
                  {event.pet}
                </p>
                <p className="text-ash text-sm leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
