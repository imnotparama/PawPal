import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/vaccinations")({
  component: VaccinationsPage,
});

const vaccinations = [
  {
    pet: "Max",
    vaccine: "Rabies Booster",
    date: "Jul 15, 2025",
    status: "upcoming",
  },
  {
    pet: "Luna",
    vaccine: "FVRCP",
    date: "Jul 28, 2025",
    status: "upcoming",
  },
  {
    pet: "Milo",
    vaccine: "DHPP",
    date: "Jun 10, 2025",
    status: "completed",
  },
  {
    pet: "Max",
    vaccine: "Bordetella",
    date: "May 22, 2025",
    status: "completed",
  },
  {
    pet: "Luna",
    vaccine: "Rabies",
    date: "Apr 3, 2025",
    status: "completed",
  },
];

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
        status === "upcoming"
          ? "bg-amber-spark/15 text-amber-spark"
          : "bg-lichen/15 text-lichen"
      }`}
    >
      {status === "upcoming" ? "Upcoming" : "Completed"}
    </span>
  );
}

function VaccinationsPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-heading font-semibold mb-2">Vaccinations</h1>
      <p className="text-smoke mb-8">
        Track upcoming and past vaccinations for all your pets.
      </p>

      {/* Table-like list */}
      <div className="border border-white/10 rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-white/10 text-xs text-smoke uppercase tracking-wider">
          <span>Pet</span>
          <span>Vaccine</span>
          <span>Date</span>
          <span>Status</span>
        </div>

        {/* Rows */}
        {vaccinations.map((v, i) => (
          <div
            key={i}
            className={`grid grid-cols-4 gap-4 px-6 py-4 text-sm ${
              i < vaccinations.length - 1 ? "border-b border-white/5" : ""
            }`}
          >
            <span className="text-bone font-medium">{v.pet}</span>
            <span className="text-ash">{v.vaccine}</span>
            <span className="text-smoke">{v.date}</span>
            <span>
              <StatusBadge status={v.status} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
