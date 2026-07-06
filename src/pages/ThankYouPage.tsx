
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, Copy, Download, Home, Share2, Check } from "lucide-react";
import WhatsAppButton from "@/components/features/WhatsAppButton";

export default function ThankYouPage() {
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const submitted = localStorage.getItem("oti_submitted");
    if (!submitted) navigate("/");
  }, [navigate]);

  const appData = (() => {
    try {
      return JSON.parse(localStorage.getItem("oti_application") || "null");
    } catch { return null; }
  })();

  // Stable refNo from localStorage — prefer OTIR format
  const refNo = (() => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("oti_app_")) {
        try {
          const app = JSON.parse(localStorage.getItem(key) || "");
          if (app.phone === appData?.phone) return app.refNo;
        } catch { /* skip */ }
      }
    }
    // Fallback: get from submitted key
    return localStorage.getItem("oti_last_refno") || `OTIR${new Date().getFullYear()}0001`;
  })();

  const formatDate = (d: string) => {
    if (!d) return "—";
    try { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }); }
    catch { return d; }
  };

  const handlePrint = () => window.print();

  const referralUrl = `${window.location.origin}/apply?ref=${encodeURIComponent(refNo)}`;

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const referralWhatsAppMsg = encodeURIComponent(
    `Hi! I joined OTI One Time Invest Plan (Ref: ${refNo}). You can apply here: ${referralUrl}`
  );

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16">
      {/* Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

      {/* ============================
          SCREEN VIEW
      ============================ */}
      <div className="relative max-w-lg w-full text-center print:hidden">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full gold-gradient flex items-center justify-center shadow-xl shadow-gold/30">
            <CheckCircle size={48} className="text-navy-dark" strokeWidth={2} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="font-serif text-4xl font-bold mb-3">
          <span className="gold-text">Application</span>
          <br />Submitted!
        </h1>
        <p className="text-muted-foreground text-base mb-8 leading-relaxed">
          Your OTI Investment Agreement has been successfully submitted.
          {appData?.fullName && (
            <> Welcome aboard, <strong className="text-foreground">{appData.fullName}</strong>.</>
          )}
        </p>

        {/* Reference Card */}
        <div className="navy-card rounded-xl p-6 border-gold/25 mb-8 text-left">
          <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-4 text-center">Application Details</p>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <span className="text-muted-foreground text-sm">Reference No.</span>
              <span className="text-gold font-bold text-sm">{refNo}</span>
            </div>
            {appData && (
              <>
                <div className="flex justify-between items-center border-b border-border pb-3">
                  <span className="text-muted-foreground text-sm">Investor Name</span>
                  <span className="text-foreground font-medium text-sm">{appData.fullName}</span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-3">
                  <span className="text-muted-foreground text-sm">Investment</span>
                  <span className="text-foreground font-medium text-sm">₹50,000 / 160 Shares</span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-3">
                  <span className="text-muted-foreground text-sm">Contract Period</span>
                  <span className="text-foreground font-medium text-sm">
                    {formatDate(appData.contractStart)} → {formatDate(appData.contractEnd)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Co-Applicant</span>
                  <span className="text-foreground font-medium text-sm">Mr. Manoj</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="navy-card rounded-xl p-5 border-blue-500/20 bg-blue-500/5 mb-8 text-left">
          <p className="text-blue-400 text-xs uppercase tracking-widest font-semibold mb-3">What Happens Next</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><span className="text-gold">1.</span> Your application will be reviewed by the OTI team.</li>
            <li className="flex gap-2"><span className="text-gold">2.</span> Co-Applicant Mr. Manoj will contact you with payment instructions.</li>
            <li className="flex gap-2"><span className="text-gold">3.</span> After ₹50,000 is confirmed, your 160 shares will be allocated.</li>
            <li className="flex gap-2"><span className="text-gold">4.</span> Keep this reference number safe: <strong className="text-foreground">{refNo}</strong></li>
          </ul>
        </div>

        {/* Referral Section */}
        <div className="navy-card rounded-xl p-5 border-gold/25 mb-8 text-left">
          <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-1">Referral Bonus</p>
          <p className="text-muted-foreground text-xs mb-4">
            Share your unique referral link. When a friend applies using your link, you earn <strong className="text-gold">25% of the middleman's 20% commission</strong>.
          </p>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              readOnly
              value={referralUrl}
              className="flex-1 min-w-0 bg-background border border-border rounded px-3 py-2 text-foreground text-xs font-mono focus:outline-none focus:ring-1 focus:ring-gold/40"
            />
            <button
              onClick={handleCopyReferral}
              className={`flex items-center gap-1.5 px-3 py-2 rounded border font-semibold text-xs transition-all flex-shrink-0 ${
                copied
                  ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                  : "border-gold/40 text-gold hover:bg-gold/10"
              }`}
            >
              {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
            </button>
          </div>
          <a
            href={`https://wa.me/?text=${referralWhatsAppMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-semibold text-sm hover:bg-emerald-500/20 transition-colors"
          >
            <Share2 size={14} /> Share via WhatsApp
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gold/40 text-gold font-semibold rounded hover:bg-gold/10 transition-colors text-sm shadow-lg shadow-gold/10"
          >
            <Download size={15} /> Download PDF Receipt
          </button>
          <Link
            to="/"
            onClick={() => localStorage.removeItem("oti_submitted")}
            className="flex items-center justify-center gap-2 px-6 py-3 gold-gradient text-navy-dark font-bold rounded hover:opacity-90 transition-opacity text-sm"
          >
            <Home size={14} /> Back to Home
          </Link>
        </div>

        {/* Disclaimer */}
        <p className="text-muted-foreground text-xs mt-8 leading-relaxed">
          This investment is made at your own risk. Please retain this reference number and a copy of your agreement for your records. For queries, contact Co-Applicant Mr. Manoj directly.
        </p>
      </div>

      {/* ============================
          PRINT-ONLY PDF RECEIPT
      ============================ */}
      <div ref={printRef} className="hidden print:block print-receipt">
        {/* Outer border */}
        <div style={{
          fontFamily: "'Times New Roman', Georgia, serif",
          color: "#111",
          maxWidth: "180mm",
          margin: "0 auto",
          border: "2px solid #333",
          padding: "12mm",
          position: "relative",
        }}>
          {/* Watermark */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%) rotate(-30deg)",
            fontSize: "72px", fontWeight: 900, color: "rgba(0,0,0,0.04)",
            whiteSpace: "nowrap", pointerEvents: "none", userSelect: "none",
          }}>
            OTI OFFICIAL
          </div>

          {/* Header */}
          <div style={{ textAlign: "center", borderBottom: "2px solid #333", paddingBottom: "8mm", marginBottom: "8mm" }}>
            <div style={{
              display: "inline-block", background: "#5a3e00", color: "#fff",
              padding: "4px 18px", borderRadius: "4px", fontWeight: 900,
              fontSize: "20px", letterSpacing: "4px", marginBottom: "8px",
            }}>
              OTI
            </div>
            <h1 style={{ fontSize: "20pt", fontWeight: 700, margin: "6px 0 2px", letterSpacing: "1px" }}>
              ONE TIME INVEST PLAN
            </h1>
            <p style={{ fontSize: "10pt", color: "#555", margin: 0, letterSpacing: "2px" }}>
              OFFICIAL INVESTMENT RECEIPT
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "40px", marginTop: "8px", fontSize: "9pt", color: "#555" }}>
              <span>Receipt No: <strong style={{ color: "#111" }}>{refNo}</strong></span>
              <span>Date: <strong style={{ color: "#111" }}>{new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</strong></span>
            </div>
          </div>

          {/* Investor Details */}
          <div style={{ marginBottom: "8mm" }}>
            <h2 style={{ fontSize: "12pt", fontWeight: 700, borderBottom: "1px solid #999", paddingBottom: "4px", marginBottom: "6px", color: "#5a3e00" }}>
              Investor Details
            </h2>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10.5pt" }}>
              <tbody>
                {[
                  ["Full Name", appData?.fullName || "—"],
                  ["Father / Husband", appData?.fatherHusbandName || "—"],
                  ["Mobile Number", appData?.phone || "—"],
                  ["Email", appData?.email || "—"],
                  ["PAN Number", appData?.panNumber || "—"],
                  ["City / State", `${appData?.city || "—"}, ${appData?.state || "—"}`],
                ].map(([k, v]) => (
                  <tr key={k} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "4px 8px", color: "#555", width: "45%", fontWeight: 600 }}>{k}</td>
                    <td style={{ padding: "4px 8px", color: "#111", fontWeight: 500 }}>: {v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Investment Summary */}
          <div style={{ marginBottom: "8mm" }}>
            <h2 style={{ fontSize: "12pt", fontWeight: 700, borderBottom: "1px solid #999", paddingBottom: "4px", marginBottom: "6px", color: "#5a3e00" }}>
              Investment Summary
            </h2>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10.5pt" }}>
              <tbody>
                {[
                  ["Investment Amount", "₹50,000"],
                  ["Shares Allocated", "160 Shares"],
                  ["Per Share Value", "₹312.50"],
                  ["Minimum Term", "10 Years"],
                  ["Commission on Sale", "20% of Total Sale Price"],
                  ["Referral Bonus", "25% of 20% Commission"],
                  ["Contract Start Date", formatDate(appData?.contractStart || "")],
                  ["Contract End Date", formatDate(appData?.contractEnd || "")],
                ].map(([k, v]) => (
                  <tr key={k} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "4px 8px", color: "#555", width: "45%", fontWeight: 600 }}>{k}</td>
                    <td style={{ padding: "4px 8px", color: "#111", fontWeight: 600 }}>: {v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Co-Applicant */}
          <div style={{
            background: "#f9f6ee", border: "1px solid #c9a84c", borderRadius: "4px",
            padding: "6mm 8mm", marginBottom: "8mm",
          }}>
            <h2 style={{ fontSize: "11pt", fontWeight: 700, margin: "0 0 4px", color: "#5a3e00" }}>
              Co-Applicant Details
            </h2>
            <p style={{ fontSize: "10.5pt", margin: "2px 0", color: "#111" }}>
              <strong>Name:</strong> Mr. Manoj
            </p>
            <p style={{ fontSize: "10pt", margin: "2px 0", color: "#555" }}>
              Co-Applicant & Share Handler — OTI One Time Invest Plan
            </p>
            <p style={{ fontSize: "10pt", margin: "4px 0 0", color: "#555", fontStyle: "italic" }}>
              Responsible for managing and handling all shares on behalf of the investor as per the agreed terms.
            </p>
          </div>

          {/* Nominee */}
          {appData?.nomineeName && (
            <div style={{ marginBottom: "8mm" }}>
              <h2 style={{ fontSize: "12pt", fontWeight: 700, borderBottom: "1px solid #999", paddingBottom: "4px", marginBottom: "6px", color: "#5a3e00" }}>
                Nominee Details
              </h2>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10.5pt" }}>
                <tbody>
                  {[
                    ["Nominee Name", appData.nomineeName],
                    ["Relationship", appData.nomineeRelationship],
                    ["Mobile", appData.nomineePhone],
                  ].map(([k, v]) => (
                    <tr key={k} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "4px 8px", color: "#555", width: "45%", fontWeight: 600 }}>{k}</td>
                      <td style={{ padding: "4px 8px", color: "#111" }}>: {v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Signature Block */}
          <div style={{ borderTop: "2px solid #333", paddingTop: "8mm", display: "flex", justifyContent: "space-between", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "10pt", color: "#555", marginBottom: "20px" }}>Investor Signature</p>
              <div style={{ borderBottom: "1.5px solid #333", marginBottom: "4px" }}>
                <p style={{ fontSize: "16pt", fontStyle: "italic", fontFamily: "Georgia, serif", minHeight: "30px" }}>
                  {appData?.signature || ""}
                </p>
              </div>
              <p style={{ fontSize: "9pt", color: "#555" }}>{appData?.fullName}</p>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "10pt", color: "#555", marginBottom: "20px" }}>Co-Applicant Signature</p>
              <div style={{ borderBottom: "1.5px solid #333", marginBottom: "4px", minHeight: "30px" }} />
              <p style={{ fontSize: "9pt", color: "#555" }}>Mr. Manoj — Co-Applicant</p>
            </div>
          </div>

          {/* Footer seal */}
          <div style={{ textAlign: "center", marginTop: "8mm", padding: "4px", border: "1px solid #c9a84c", borderRadius: "4px", background: "#fdf8ee" }}>
            <p style={{ fontSize: "9pt", fontWeight: 700, color: "#5a3e00", margin: 0, letterSpacing: "2px" }}>
              🛡️ OTI OFFICIAL INVESTMENT RECEIPT — NOT A GOVERNMENT DOCUMENT
            </p>
          </div>
        </div>
      </div>

      <WhatsAppButton />
    </div>
  );
}
