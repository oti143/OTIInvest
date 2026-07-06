import { useState } from "react";
import { Search, CheckCircle, Clock, TrendingUp, AlertCircle, Home } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/features/WhatsAppButton";

type StatusType = "Submitted" | "Under Review" | "Shares Allocated";

interface AppResult {
  refNo: string;
  fullName: string;
  phone: string;
  contractStart: string;
  contractEnd: string;
  status: StatusType;
  submittedAt: string;
  city: string;
  state: string;
  nomineeName: string;
}

const STATUS_STEPS: { key: StatusType; label: string; desc: string; icon: typeof CheckCircle }[] = [
  { key: "Submitted", label: "Application Submitted", desc: "Your application has been received successfully.", icon: CheckCircle },
  { key: "Under Review", label: "Under Review", desc: "Our team is reviewing your application and KYC details.", icon: Clock },
  { key: "Shares Allocated", label: "Shares Allocated", desc: "Your 160 shares have been allocated. Investment is now active.", icon: TrendingUp },
];

export default function StatusPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<AppResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    setNotFound(false);
    setResult(null);

    const q = query.trim().toLowerCase();
    if (!q) return;

    // Search all oti_app_ keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("oti_app_")) {
        try {
          const app = JSON.parse(localStorage.getItem(key) || "");
          if (
            app.refNo?.toLowerCase() === q ||
            app.phone === q
          ) {
            setResult(app);
            return;
          }
        } catch { /* skip */ }
      }
    }

    // Fallback: check oti_application + oti_submitted
    const current = localStorage.getItem("oti_application");
    const submitted = localStorage.getItem("oti_submitted");
    if (current && submitted) {
      try {
        const app = JSON.parse(current);
        if (app.phone === q) {
          setResult({
            ...app,
            refNo: "OTI-PENDING",
            status: "Submitted",
            submittedAt: new Date().toISOString(),
          });
          return;
        }
      } catch { /* skip */ }
    }

    setNotFound(true);
  };

  const getStepIndex = (status: StatusType) =>
    STATUS_STEPS.findIndex((s) => s.key === status);

  const formatDate = (d: string) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
    } catch { return d; }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20 pb-16 px-4 sm:px-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mt-10 mb-10">
          <p className="text-gold uppercase tracking-widest text-xs font-semibold mb-2">OTI Portal</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2">Application Status</h1>
          <p className="text-muted-foreground text-sm">Track your OTI investment application in real time</p>
          <div className="w-16 h-0.5 gold-gradient mx-auto mt-4" />
        </div>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="navy-card rounded-xl p-6 border-gold/20 mb-8">
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Enter Reference Number or Mobile Number
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. OTI-12345678 or 9876543210"
                className="w-full bg-navy-light/50 border border-border rounded pl-9 pr-3 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-gold/60 focus:border-gold/60 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 gold-gradient text-navy-dark font-bold rounded hover:opacity-90 transition-opacity text-sm whitespace-nowrap"
            >
              Track
            </button>
          </div>
          <p className="text-muted-foreground text-xs mt-2">
            Use the reference number from your confirmation email or your registered mobile number.
          </p>
        </form>

        {/* Not Found */}
        {searched && notFound && (
          <div className="navy-card rounded-xl p-8 border-amber-500/20 text-center">
            <AlertCircle size={36} className="text-amber-400 mx-auto mb-3" />
            <p className="text-foreground font-semibold mb-1">No Application Found</p>
            <p className="text-muted-foreground text-sm">
              No application matches this reference number or mobile number. Please check and try again.
            </p>
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 gold-gradient text-navy-dark font-bold rounded hover:opacity-90 transition-opacity text-sm"
            >
              Apply Now
            </Link>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-5 animate-fade-in">
            {/* Basic Info Card */}
            <div className="navy-card rounded-xl p-6 border-gold/25">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-1">Reference Number</p>
                  <p className="text-foreground font-mono font-bold text-lg">{result.refNo}</p>
                </div>
                <span className={`px-3 py-1.5 rounded-full border text-xs font-bold ${
                  result.status === "Submitted" ? "text-blue-400 bg-blue-400/10 border-blue-400/30" :
                  result.status === "Under Review" ? "text-amber-400 bg-amber-400/10 border-amber-400/30" :
                  "text-emerald-400 bg-emerald-400/10 border-emerald-400/30"
                }`}>
                  {result.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  ["Investor Name", result.fullName],
                  ["Mobile", result.phone],
                  ["City / State", `${result.city || "—"}, ${result.state || "—"}`],
                  ["Nominee", result.nomineeName || "—"],
                  ["Contract Start", formatDate(result.contractStart)],
                  ["Contract End", formatDate(result.contractEnd)],
                  ["Submitted On", formatDate(result.submittedAt)],
                  ["Investment", "₹50,000 / 160 Shares"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-muted-foreground text-xs mb-0.5">{k}</p>
                    <p className="text-foreground font-medium">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Tracker */}
            <div className="navy-card rounded-xl p-6 border-gold/20">
              <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-6">Application Progress</p>
              <div className="relative">
                {/* Track line */}
                <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-border" />
                <div
                  className="absolute left-5 top-5 w-0.5 bg-gradient-to-b from-gold to-gold/30 transition-all duration-500"
                  style={{ height: `${(getStepIndex(result.status) / (STATUS_STEPS.length - 1)) * 100}%` }}
                />

                <div className="space-y-8">
                  {STATUS_STEPS.map((step, idx) => {
                    const isCompleted = idx <= getStepIndex(result.status);
                    const isCurrent = step.key === result.status;
                    const Icon = step.icon;
                    return (
                      <div key={step.key} className="flex gap-4 relative">
                        <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                          isCompleted
                            ? "gold-gradient border-gold"
                            : "border-border bg-background"
                        }`}>
                          <Icon size={16} className={isCompleted ? "text-navy-dark" : "text-muted-foreground"} />
                        </div>
                        <div className="pt-1.5">
                          <p className={`font-semibold text-sm ${isCurrent ? "gold-text" : isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                            {step.label}
                            {isCurrent && (
                              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30">Current</span>
                            )}
                          </p>
                          <p className={`text-xs mt-0.5 ${isCompleted ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Co-Applicant Note */}
            <div className="p-4 rounded border border-border bg-navy-dark/50 text-sm text-muted-foreground">
              <p>
                <span className="text-foreground font-medium">Co-Applicant Mr. Manoj</span> will contact you directly regarding payment confirmation and share allocation.
                Keep your reference number <span className="text-gold font-mono">{result.refNo}</span> handy.
              </p>
            </div>

            <div className="flex justify-center">
              <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors text-sm">
                <Home size={14} /> Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
