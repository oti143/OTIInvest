import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, Users, Download, Search, LogOut, Calendar, CreditCard, ChevronDown, ChevronUp, Mail, Phone, Trash2 } from "lucide-react";
import { normalizeRefNumbers } from "@/lib/refNumber";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { ApplicationForm } from "@/types";

const ADMIN_USERNAME = "Manoj";
const ADMIN_PASSWORD = "Manoj@9972584110";

interface StoredApp extends ApplicationForm {
  refNo: string;
  submittedAt: string;
  status: "Submitted" | "Under Review" | "Shares Allocated";
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [applications, setApplications] = useState<StoredApp[]>([]);
  const [search, setSearch] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("All");

  useEffect(() => {
    const auth = sessionStorage.getItem("oti_admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
      loadApplications();
    }
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!isAuthenticated) return;

    const channel = supabase
      .channel("registrations")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "registrations" },
        () => {
          loadApplications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated]);

  const loadApplications = async () => {
    try {
      // Fetch from Supabase
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (error) {
        console.error("Error loading applications:", error);
        return;
      }

      // Also load from localStorage for legacy applications
      normalizeRefNumbers();
      const localStorage_apps: StoredApp[] = [];
      const seen = new Set<string>();

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("oti_app_")) {
          try {
            const app = JSON.parse(localStorage.getItem(key) || "") as StoredApp;
            if (!seen.has(app.phone)) {
              seen.add(app.phone);
              localStorage_apps.push(app);
            }
          } catch { /* skip */ }
        }
      }

      // Combine Supabase data with localStorage data
      const all: StoredApp[] = (data || [])
        .map((item: any, index: number) => ({
          refNo: `OTIR-${String(index + 1).padStart(5, "0")}`,
          fullName: item.full_name,
          phone: item.phone,
          email: item.email,
          submittedAt: item.submitted_at,
          status: "Submitted" as const,
          fatherHusbandName: "",
          dateOfBirth: "",
          gender: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
          aadhaarNumber: "",
          panNumber: "",
          bankName: "",
          ifscCode: "",
          bankAccountNumber: "",
          nomineeName: "",
          nomineeRelationship: "",
          nomineePhone: "",
          contractStart: "",
          contractEnd: "",
          referralName: "",
          referralPhone: "",
          signature: "",
        }))
        .concat(
          localStorage_apps.filter(
            (la) => !(data || []).some((sa: any) => sa.phone === la.phone)
          )
        );

      setApplications(all);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim()) {
      setError("Please enter the admin username.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter the admin password.");
      return;
    }
    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem("oti_admin_auth", "true");
      setIsAuthenticated(true);
      loadApplications();
    } else {
      setError("Invalid username or password. Please try again.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("oti_admin_auth");
    setIsAuthenticated(false);
    setPassword("");
    setUsername("");
  };

  const handleStatusChange = (refNo: string, status: StoredApp["status"]) => {
    const key = `oti_app_${refNo}`;
    const existing = localStorage.getItem(key);
    if (existing) {
      const parsed = JSON.parse(existing);
      const updated = { ...parsed, status };
      localStorage.setItem(key, JSON.stringify(updated));
      setApplications((prev) => prev.map((a) => a.refNo === refNo ? { ...a, status } : a));
    }
  };

  const handleNotifyInvestor = (app: StoredApp) => {
    if (!app.email) {
      alert("No email address found for this investor. Cannot send notification.");
      return;
    }
    const subject = encodeURIComponent(`OTI Application Status Update – ${app.refNo}`);
    const body = encodeURIComponent(
      `Dear ${app.fullName},\n\nWe would like to inform you that the status of your OTI application (Reference Number: ${app.refNo}) has been updated.\n\nCurrent Status:\n${app.status}\n\nIf you have any questions, please contact our support team.\n\nThank you for choosing OTI – One Time Invest Plan.\n\nRegards,\nManoj\nOTI Administration Team`
    );
    window.open(`mailto:${app.email}?subject=${subject}&body=${body}`, "_blank");
  };

  const handleDeleteApplication = async (app: StoredApp) => {
    if (!window.confirm(`Are you sure you want to delete the application for ${app.fullName}? This action cannot be undone.`)) {
      return;
    }

    try {
      // Delete from localStorage
      const key = `oti_app_${app.refNo}`;
      localStorage.removeItem(key);

      // Delete from Supabase
      if (app.phone) {
        await supabase
          .from("registrations")
          .delete()
          .eq("phone", app.phone);
      }

      // Update UI
      setApplications((prev) => prev.filter((a) => a.refNo !== app.refNo));
      setExpandedRow(null);
      toast.success(`Application ${app.refNo} deleted successfully`);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete application");
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Ref No", "Name", "Father/Husband", "DOB", "Gender", "Phone", "Email",
      "Address", "City", "State", "Pincode", "Aadhaar (Last 4)", "PAN",
      "Bank", "IFSC", "Account (Last 4)", "Nominee", "Nominee Relation",
      "Nominee Phone", "Referral Name", "Referral Phone",
      "Contract Start", "Contract End", "Status", "Submitted At"
    ];
    const rows = applications.map((a) => [
      a.refNo, a.fullName, a.fatherHusbandName, a.dateOfBirth, a.gender, a.phone, a.email,
      a.address, a.city, a.state, a.pincode,
      `****${a.aadhaarNumber?.slice(-4)}`, a.panNumber,
      a.bankName, a.ifscCode, `****${a.bankAccountNumber?.slice(-4)}`,
      a.nomineeName, a.nomineeRelationship, a.nomineePhone,
      a.referralName || "", a.referralPhone || "",
      a.contractStart, a.contractEnd, a.status, a.submittedAt
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `OTI_Applications_${new Date().toLocaleDateString("en-IN").replace(/\//g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = applications.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.fullName?.toLowerCase().includes(q) || a.phone?.includes(q) || a.refNo?.toLowerCase().includes(q) || a.email?.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusColors: Record<string, string> = {
    "Submitted": "text-blue-400 bg-blue-400/10 border-blue-400/30",
    "Under Review": "text-amber-400 bg-amber-400/10 border-amber-400/30",
    "Shares Allocated": "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(rgba(201,168,76,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }}
        />
        <div className="relative max-w-sm w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 gold-gradient rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gold/20">
              <Lock size={28} className="text-navy-dark" />
            </div>
            <h1 className="font-serif text-2xl font-bold gold-text">Admin Panel</h1>
            <p className="text-muted-foreground text-sm mt-1">OTI — One Time Invest Plan</p>
          </div>

          <form onSubmit={handleLogin} className="navy-card rounded-xl p-8 border-gold/20">
            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Admin Username *
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(""); }}
                placeholder="Enter username"
                className="w-full bg-navy-light/50 border border-border rounded px-3 py-3 text-foreground focus:outline-none focus:ring-1 focus:ring-gold/60 focus:border-gold/60 transition-colors"
                autoComplete="username"
                autoFocus
              />
            </div>
            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Admin Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter admin password"
                  className="w-full bg-navy-light/50 border border-border rounded px-3 py-3 text-foreground pr-10 focus:outline-none focus:ring-1 focus:ring-gold/60 focus:border-gold/60 transition-colors"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {error && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                  <span>⚠</span> {error}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 gold-gradient text-navy-dark font-bold rounded hover:opacity-90 transition-opacity"
            >
              Login to Dashboard
            </button>
          </form>

          <p className="text-center text-muted-foreground text-xs mt-4">
            <button onClick={() => navigate("/")} className="hover:text-gold transition-colors">
              ← Back to Home
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gold/20 bg-navy-dark/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 gold-gradient rounded-sm flex items-center justify-center">
              <span className="text-navy-dark font-serif font-bold text-sm">OTI</span>
            </div>
            <div>
              <p className="gold-text font-serif font-semibold text-sm leading-tight">Admin Dashboard</p>
              <p className="text-muted-foreground text-[10px] uppercase tracking-widest">Welcome, Manoj</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-xs hidden sm:block">{applications.length} total applications</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 border border-border rounded text-muted-foreground hover:text-foreground hover:border-gold/30 transition-colors text-sm"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-20 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 mb-8">
          {[
            { label: "Total Applications", value: applications.length, color: "gold-text" },
            { label: "Submitted", value: applications.filter((a) => a.status === "Submitted").length, color: "text-blue-400" },
            { label: "Under Review", value: applications.filter((a) => a.status === "Under Review").length, color: "text-amber-400" },
            { label: "Shares Allocated", value: applications.filter((a) => a.status === "Shares Allocated").length, color: "text-emerald-400" },
          ].map((s) => (
            <div key={s.label} className="navy-card rounded-lg p-4 text-center border-gold/15">
              <p className={`text-3xl font-serif font-bold ${s.color}`}>{s.value}</p>
              <p className="text-muted-foreground text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, phone, ref no, email..."
                className="bg-navy-light/50 border border-border rounded pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-gold/60 w-full sm:w-80"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-navy-light/50 border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-gold/60"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Shares Allocated">Shares Allocated</option>
            </select>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 gold-gradient text-navy-dark font-bold rounded hover:opacity-90 transition-opacity text-sm"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>

        {/* Applications Table */}
        {filtered.length === 0 ? (
          <div className="navy-card rounded-xl p-16 text-center border-gold/15">
            <Users size={40} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {applications.length === 0
                ? "No applications submitted yet."
                : "No applications match your search."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((app) => (
              <div key={app.refNo} className="navy-card rounded-lg border-gold/15 overflow-hidden">
                {/* Row Header */}
                <div
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 cursor-pointer hover:bg-gold/5 transition-colors"
                  onClick={() => setExpandedRow(expandedRow === app.refNo ? null : app.refNo)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-gold font-mono text-xs font-semibold">{app.refNo}</span>
                      <span className={`px-2 py-0.5 rounded-full border text-xs font-semibold ${statusColors[app.status]}`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-foreground font-semibold truncate">{app.fullName}</p>
                    <p className="text-muted-foreground text-xs">{app.phone} {app.email ? `• ${app.email}` : ""}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar size={11} />{new Date(app.submittedAt).toLocaleDateString("en-IN")}</span>
                    <span className="flex items-center gap-1"><CreditCard size={11} />{app.panNumber}</span>
                  </div>
                  <div className="ml-auto pl-2">
                    {expandedRow === app.refNo ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedRow === app.refNo && (
                  <div className="border-t border-border p-4 bg-navy-dark/50">
                    {/* Full private details (Admin only) */}
                    <div className="mb-3">
                      <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-3">Full Applicant Details (Admin Only)</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[
                          ["Mobile", app.phone],
                          ["Email", app.email || "—"],
                          ["Father/Husband", app.fatherHusbandName],
                          ["Date of Birth", app.dateOfBirth],
                          ["Gender", app.gender],
                          ["Address", app.address],
                          ["City", app.city],
                          ["State", app.state],
                          ["Pincode", app.pincode],
                          ["Aadhaar", `****${app.aadhaarNumber?.slice(-4)}`],
                          ["PAN", app.panNumber],
                          ["Bank", app.bankName],
                          ["IFSC", app.ifscCode],
                          ["Account No.", `****${app.bankAccountNumber?.slice(-4)}`],
                          ["Nominee", `${app.nomineeName} (${app.nomineeRelationship})`],
                          ["Nominee Mobile", app.nomineePhone],
                          ["Contract Start", app.contractStart],
                          ["Contract End", app.contractEnd],
                          ["Referral", app.referralName ? `${app.referralName} / ${app.referralPhone}` : "None"],
                          ["Signature", app.signature],
                        ].map(([k, v]) => (
                          <div key={k}>
                            <p className="text-muted-foreground text-xs mb-0.5">{k}</p>
                            <p className="text-foreground text-sm font-medium break-words">{v}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status Control + Notify */}
                    <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border">
                      <span className="text-muted-foreground text-xs">Update Status:</span>
                      {(["Submitted", "Under Review", "Shares Allocated"] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(app.refNo, s)}
                          className={`px-3 py-1.5 rounded border text-xs font-semibold transition-all ${
                            app.status === s
                              ? statusColors[s]
                              : "border-border text-muted-foreground hover:border-gold/30 hover:text-foreground"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                      <div className="ml-auto flex gap-2">
                        {app.phone && (
                          <a
                            href={`tel:${app.phone}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border text-muted-foreground hover:text-foreground hover:border-gold/30 transition-colors text-xs"
                          >
                            <Phone size={12} /> Call
                          </a>
                        )}
                        <button
                          onClick={() => handleNotifyInvestor(app)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-blue-400/30 text-blue-400 hover:bg-blue-400/10 transition-colors text-xs font-semibold"
                          title={app.email ? `Notify ${app.email}` : "No email on file"}
                        >
                          <Mail size={12} /> Notify Investor
                        </button>
                        <button
                          onClick={() => handleDeleteApplication(app)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-red-400/30 text-red-400 hover:bg-red-400/10 transition-colors text-xs font-semibold"
                          title={`Delete application for ${app.fullName}`}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
