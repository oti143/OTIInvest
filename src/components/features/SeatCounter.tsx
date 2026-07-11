import { useEffect, useState } from "react";
import { Users, AlertTriangle, Flame } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { registrationEmitter } from "@/lib/registrationEmitter";

const TOTAL_SEATS = 6000;

export default function SeatCounter() {
  const [filled, setFilled] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch registration count from Supabase
  const fetchCount = async () => {
    try {
      const { count, error } = await supabase
        .from("registrations")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("Error fetching count:", error);
        return;
      }

      setFilled(count || 0);
      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCount();

    // Subscribe to shared emitter
    const unsubscribe = registrationEmitter.subscribe(() => {
      console.log("📢 SeatCounter received emitter update");
      fetchCount();
    });

    // Subscribe to real-time updates
    let subscription: any = null;

    try {
      subscription = supabase
        .channel(`seat-counter-${Date.now()}`, { config: { broadcast: { self: true } } })
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "registrations" },
          (payload: any) => {
            console.log("📢 New registration for seat counter:", payload);
            fetchCount();
          }
        )
        .on(
          "postgres_changes",
          { event: "DELETE", schema: "public", table: "registrations" },
          (payload: any) => {
            console.log("📢 Registration deleted for seat counter:", payload);
            fetchCount();
          }
        )
        .subscribe((status: string) => {
          console.log("Seat counter subscription status:", status);
        });
    } catch (err) {
      console.error("Error setting up seat counter subscription:", err);
    }

    // Fallback: Poll every 3 seconds for seat count
    const pollInterval = setInterval(() => {
      console.log("🔄 Polling seat count...");
      fetchCount();
    }, 3000);

    return () => {
      unsubscribe();
      if (subscription) {
        supabase.removeChannel(subscription);
      }
      clearInterval(pollInterval);
    };
  }, []);

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
          {loading ? "..." : remaining.toLocaleString("en-IN")}
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
        {loading ? "Loading..." : `${filled.toLocaleString("en-IN")} seats claimed · ${pct.toFixed(1)}% filled`}
      </p>
    </div>
  );
}
