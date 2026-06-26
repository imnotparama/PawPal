import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

const stats = [
  { label: "Total Pets", value: "3", accent: false },
  { label: "Upcoming Vaccines", value: "2", accent: false },
  { label: "AI Conversations", value: "47", accent: false },
  { label: "Health Score", value: "92%", accent: true },
];

const recentActivity = [
  {
    time: "2 hours ago",
    text: "Luna's vaccination record updated — Rabies booster complete",
  },
  {
    time: "Yesterday",
    text: "AI Chat: Discussed Max's dietary needs for senior dogs",
  },
  {
    time: "3 days ago",
    text: "Milo added to your pet profile — Welcome, Milo!",
  },
  {
    time: "1 week ago",
    text: "Health Score improved from 87% to 92% across all pets",
  },
];

function Dashboard() {
  return (
    <div className="max-w-5xl">
      <h1 className="text-heading font-semibold mb-2">Welcome back</h1>
      <p className="text-smoke mb-8">
        Here's what's happening with your pets today.
      </p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-transparent border border-white/10 rounded-3xl p-6"
          >
            <p className="text-smoke text-sm mb-1">{stat.label}</p>
            <p
              className={`text-3xl font-bold ${stat.accent ? "text-lichen" : "text-bone"}`}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-3">
        {recentActivity.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-4 border border-white/10 rounded-3xl p-5"
          >
            <div className="w-2 h-2 mt-2 rounded-full bg-plum-voltage shrink-0" />
            <div>
              <p className="text-bone text-sm">{item.text}</p>
              <p className="text-smoke text-xs mt-1">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
