import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/records")({
  component: RecordsPage,
});

const records = [
  {
    date: "Jun 12, 2025",
    title: "Annual Checkup — Max",
    provider: "Dr. Sarah Chen, Valley Vet Clinic",
    notes: "All vitals normal. Weight stable at 32kg. Slight tartar buildup — dental cleaning recommended.",
  },
  {
    date: "May 28, 2025",
    title: "Ear Infection Treatment — Max",
    provider: "Dr. Sarah Chen, Valley Vet Clinic",
    notes: "Prescribed Otomax drops for 10 days. Follow-up in 2 weeks.",
  },
  {
    date: "Apr 15, 2025",
    title: "Spay Surgery — Luna",
    provider: "Dr. James Park, Downtown Animal Hospital",
    notes: "Surgery successful. Recovery normal. Stitches removed Apr 25.",
  },
  {
    date: "Mar 3, 2025",
    title: "Puppy Wellness Visit — Milo",
    provider: "Dr. Sarah Chen, Valley Vet Clinic",
    notes: "First visit. Healthy puppy, 4.2kg. Deworming administered. Next vaccines scheduled.",
  },
  {
    date: "Feb 10, 2025",
    title: "Allergy Consultation — Max",
    provider: "Dr. Lisa Wong, Pet Dermatology Specialists",
    notes: "Suspected environmental allergies. Started on Apoquel 16mg daily.",
  },
];

function RecordsPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-heading font-semibold mb-2">Medical Records</h1>
      <p className="text-smoke mb-8">
        Complete history of vet visits, treatments, and procedures.
      </p>

      <div className="space-y-4">
        {records.map((record, i) => (
          <div
            key={i}
            className="border border-white/10 rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-bone font-semibold">{record.title}</h3>
              <span className="text-smoke text-xs">{record.date}</span>
            </div>
            <p className="text-smoke text-xs mb-2">{record.provider}</p>
            <p className="text-ash text-sm leading-relaxed">{record.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
