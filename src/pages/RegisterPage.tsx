import { useMemo } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Users, ChevronRight, Shield } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/features/WhatsAppButton";
import { formatRefNumber } from "@/lib/refNumber";

interface RegisterEntry {
  regNo: string;
  name: string;
  submittedAt: string;
}

function generateRegNo(index: number, date: string): string {
  const year = date ? new Date(date).getFullYear() : new Date().getFullYear();
  return formatRefNumber(year, index + 1);
}

function loadRegistrations(): RegisterEntry[] {
  const entries: RegisterEntry[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("oti_app_")) {
      try {
        const app = JSON.parse(localStorage.getItem(key) || "");
        if (app.fullName && !seen.has(app.phone)) {
          seen.add(app.phone);
          entries.push({
            regNo: "", // will assign below
            name: app.fullName,
            submittedAt: app.submittedAt || new Date().toISOString(),
          });
        }
      } catch { /* skip */ }
    }
  }

  // Sort by submittedAt ascending to assign sequential numbers
  entries.sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());

  // Assign registration numbers
  return entries.map((e, i) => ({
    ...e,
    regNo: generateRegNo(i, e.submittedAt),
  }));
}

function formatDate(d: string) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return d; }
}

export default function RegisterPage() {
  const registrations = useMemo(() => loadRegistrations(), []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20 pb-16 px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mt-10 mb-10">
          <p className="text-gold uppercase tracking-widest text-xs font-semibold mb-2">OTI Portal</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Registered Members
          </h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Official OTI investment registration list. Reference numbers are publicly listed to maintain transparency.
          </p>
          <div className="w-16 h-0.5 gold-gradient mx-auto mt-4" />
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Registered", value: registrations.length, color: "gold-text" },
            { label: "Seats Remaining", value: 6000 - registrations.length, color: "text-emerald-400" },
            { label: "Total Capacity", value: "6,000", color: "text-muted-foreground" },
          ].map((s) => (
            <div key={s.label} className="navy-card rounded-lg p-4 text-center border-gold/15">
              <p className={`text-2xl sm:text-3xl font-serif font-bold ${s.color}`}>
                {typeof s.value === "number" ? s.value.toLocaleString("en-IN") : s.value}
              </p>
              <p className="text-muted-foreground text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Privacy Notice */}
        <div className="flex gap-3 p-4 rounded border border-gold/20 bg-gold/5 mb-6">
          <Shield size={15} className="text-gold flex-shrink-0 mt-0.5" />
          <p className="text-muted-foreground text-xs leading-relaxed">
            <span className="text-foreground font-semibold">Privacy Notice:</span> Only registration numbers and investor names are displayed publicly. 
            Mobile numbers, Aadhaar, PAN, bank details, and all personal information are fully protected and never shared.
          </p>
        </div>

        {/* Table */}
        {registrations.length === 0 ? (
          <div className="navy-card rounded-xl p-16 text-center border-gold/15">
            <Users size={40} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-semibold">No registrations yet.</p>
            <p className="text-muted-foreground text-sm mt-2">Be the first to secure your seat!</p>
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 gold-gradient text-navy-dark font-bold rounded hover:opacity-90 transition-opacity text-sm"
            >
              Apply Now <ChevronRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="navy-card rounded-xl border-gold/15 overflow-hidden">
            {/* Table Header */}
            <div
              className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-border text-xs font-semibold uppercase tracking-widest text-muted-foreground"
              style={{ background: "rgba(201,168,76,0.05)" }}
            >
              <div className="col-span-1">#</div>
              <div className="col-span-5 sm:col-span-4">Reg. Number</div>
              <div className="col-span-6 sm:col-span-5">Investor Name</div>
              <div className="hidden sm:block col-span-3">Registered On</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-border/50">
              {registrations.map((reg, i) => (
                <div
                  key={reg.regNo}
                  className="grid grid-cols-12 gap-3 px-5 py-3.5 hover:bg-gold/3 transition-colors items-center text-sm"
                >
                  <div className="col-span-1 text-muted-foreground text-xs font-mono">
                    {i + 1}
                  </div>
                  <div className="col-span-5 sm:col-span-4">
                    <span className="text-gold font-mono font-semibold text-xs sm:text-sm tracking-wide">
                      {reg.regNo}
                    </span>
                  </div>
                  <div className="col-span-6 sm:col-span-5">
                    <span className="text-foreground font-medium">{reg.name}</span>
                  </div>
                  <div className="hidden sm:block col-span-3 text-muted-foreground text-xs">
                    {formatDate(reg.submittedAt)}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div
              className="px-5 py-3 border-t border-border flex items-center justify-between"
              style={{ background: "rgba(5,8,22,0.5)" }}
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <BookOpen size={12} className="text-gold" />
                <span>Showing {registrations.length} of 6,000 total seats</span>
              </div>
              <Link
                to="/apply"
                className="flex items-center gap-1.5 text-xs text-gold hover:underline font-semibold"
              >
                Secure your seat <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        )}

        {/* CTA */}
        {registrations.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-muted-foreground text-sm mb-4">
              Don't miss your chance — only <strong className="text-gold">{(6000 - registrations.length).toLocaleString("en-IN")}</strong> seats remaining.
            </p>
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 px-8 py-3.5 gold-gradient text-navy-dark font-bold rounded hover:opacity-90 transition-opacity shadow-lg shadow-gold/20"
            >
              Apply for OTI Investment <ChevronRight size={16} />
            </Link>
          </div>
        )}
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
