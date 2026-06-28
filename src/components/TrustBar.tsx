import { motion } from "framer-motion";

const stats = [
  { number: "VET-BACKED", label: "Clinical Science" },
  { number: "GEMINI AI", label: "Real-Time Triage" },
  { number: "SECURE", label: "Encrypted Records" },
];

export function TrustBar() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="flex items-center gap-8 mt-10"
    >
      {stats.map((stat, i) => (
        <div key={stat.label} className="flex items-center gap-8">
          <div className="flex flex-col items-center">
            <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>
              {stat.number}
            </span>
            <span style={{ color: "#9a9a9a", fontWeight: 400, fontSize: 13 }}>
              {stat.label}
            </span>
          </div>
          {i < stats.length - 1 && (
            <div style={{ width: 1, height: 32, alignSelf: "center", backgroundColor: "rgba(255,255,255,0.15)" }} />
          )}
        </div>
      ))}
    </motion.div>
  );
}
