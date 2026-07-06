import { useMemo } from "react";
import { Users, AlertTriangle, Flame } from "lucide-react";

const TOTAL_SEATS = 6000;

function getSubmittedCount(): number {
  let count = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("oti_app_")) count++;
  }
  // Demo: minimum 1 if there's a submitted application
  const submitted = localStorage.getItem("oti_submitted");
  if (submitted && count === 0) count = 1;
  return count;
}

export default function SeatCounter() {
  const filled = useMemo(() => getSubmittedCount(), []);
  const remaining = TOTAL_SEATS - filled;
  const pct = (filled / TOTAL_SEATS) * 100;

  const urgency =
    pct >= 80
      ? { color: "text-red-400", bar: "bg-red-500", border: "border-red-500/30", bg: "bg-red-500/10", icon: Flame, label: "Critical — Almost Full!" }
      : pct >= 50
      ? { color: "text-amber-400", bar: "bg-amber-500", border: "border-amber-500/30", bg: "bg-amber-500/10", icon: AlertTriangle, label: "Filling Fast" }
      : { color: "text-emerald-400", bar: "bg-emerald-500", border: "border-emerald-500/30", bg: "bg-emerald-500/10", icon: Users, label: "Seats Available" };

  const Icon = urgency.icon;

  return (
    <div className={`rounded-xl border p-4 sm:p-5 mt-6 max-w-sm ${urgency.bg} ${urgency.border}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon size={15} className={urgency.color} />
        <span className={`text-xs font-semibold uppercase tracking-wide ${urgency.color}`}>
          {urgency.label}
        </span>
      </div>

      {/* Counter */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="font-serif text-4xl font-bold text-foreground">
          {remaining.toLocaleString("en-IN")}
        </span>
        <span className="text-muted-foreground text-sm">/ {TOTAL_SEATS.toLocaleString("en-IN")} seats remaining</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-background/50 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${urgency.bar}`}
          style={{ width: `${Math.max(pct, 0.5)}%` }}
        />
      </div>
      <p className="text-muted-foreground text-xs">
        {filled.toLocaleString("en-IN")} seats claimed · {pct.toFixed(1)}% filled
      </p>
    </div>
  );
}
