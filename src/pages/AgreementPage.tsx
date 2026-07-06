import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Printer, CheckCircle, Shield, AlertTriangle, FileText } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import WhatsAppButton from "@/components/features/WhatsAppButton";
import TermsModal from "@/components/features/TermsModal";
import { TERMS } from "@/constants";
import { generateOTIRefNumber } from "@/lib/refNumber";
import type { ApplicationForm } from "@/types";

export default function AgreementPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const formData: ApplicationForm | null = location.state?.formData || (() => {
    try {
      return JSON.parse(localStorage.getItem("oti_application") || "null");
    } catch { return null; }
  })();

  useEffect(() => {
    if (!formData) {
      toast.error("No application data found. Please fill the form first.");
      navigate("/apply");
    }
  }, [formData, navigate]);

  if (!formData) return null;

  const formatDate = (d: string) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  };

  const handleConfirm = () => {
    const refNo = generateOTIRefNumber();
    const appWithMeta = {
      ...formData,
      refNo,
      submittedAt: new Date().toISOString(),
      status: "Submitted",
    };
    localStorage.setItem(`oti_app_${refNo}`, JSON.stringify(appWithMeta));
    localStorage.setItem("oti_submitted", "true");
    navigate("/thank-you");
  };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-background">
      {showTermsModal && <TermsModal onClose={() => setShowTermsModal(false)} />}
      <Navbar />

      <div className="pt-20 pb-16 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="text-center mt-8 mb-8">
          <p className="text-gold uppercase tracking-widest text-xs font-semibold mb-2">Final Step</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Investment Agreement</h1>
          <p className="text-muted-foreground text-sm mt-2">Review your agreement carefully before confirming</p>
          <div className="w-16 h-0.5 gold-gradient mx-auto mt-4" />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-end gap-3 mb-6 print:hidden">
          <button
            onClick={() => setShowTermsModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gold/30 text-gold rounded hover:bg-gold/10 transition-colors text-sm"
          >
            <FileText size={15} /> View All Terms
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded text-muted-foreground hover:text-foreground hover:border-gold/40 transition-colors text-sm"
          >
            <Printer size={15} /> Print / Save PDF
          </button>
          <button
            onClick={handleConfirm}
            className="flex items-center gap-2 px-6 py-2.5 gold-gradient text-navy-dark font-bold rounded hover:opacity-90 transition-opacity text-sm"
          >
            <CheckCircle size={15} /> Confirm & Submit
          </button>
        </div>

        {/* Agreement Document */}
        <div ref={printRef} className="navy-card rounded-xl border border-gold/25 p-8 sm:p-12 print:p-8 print:border print:border-gray-300 print:text-black print:bg-white">

          {/* Document Header */}
          <div className="text-center border-b border-gold/20 pb-8 mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 gold-gradient rounded-md flex items-center justify-center">
                <span className="text-navy-dark font-serif font-bold text-xl">OTI</span>
              </div>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold gold-text print:text-gray-900 mb-1">
              ONE TIME INVEST PLAN
            </h2>
            <p className="text-muted-foreground text-sm uppercase tracking-widest">Investment Agreement &amp; Declaration</p>
            <div className="flex justify-center gap-6 mt-4 text-xs text-muted-foreground">
              <span>Date: <strong className="text-foreground">{formatDate(formData.contractStart)}</strong></span>
            </div>
          </div>

          {/* Contract Parties */}
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div className="p-4 rounded border border-gold/20 bg-gold/5">
              <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-3">Investor (First Party)</p>
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ["Name", formData.fullName],
                    ["Father/Husband", formData.fatherHusbandName],
                    ["Date of Birth", formatDate(formData.dateOfBirth)],
                    ["Gender", formData.gender],
                    ["PAN", formData.panNumber],
                    ["Aadhaar", `XXXX XXXX ${formData.aadhaarNumber?.slice(-4)}`],
                  ].map(([k, v]) => (
                    <tr key={k}>
                      <td className="text-muted-foreground py-0.5 pr-3 font-medium w-32">{k}</td>
                      <td className="text-foreground py-0.5">: {v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 rounded border border-border bg-secondary/30">
              <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-3">Co-Applicant (Second Party)</p>
              <p className="text-foreground font-semibold text-lg font-serif mb-2">Mr. Manoj</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Co-Applicant and Share Handler for the OTI One Time Invest Plan. Responsible for managing and handling all shares on behalf of the investor as per the agreed terms.
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="mb-6 p-4 rounded border border-border bg-secondary/20">
            <p className="text-muted-foreground text-xs uppercase tracking-widest font-semibold mb-2">Investor Address</p>
            <p className="text-foreground text-sm">{formData.address}, {formData.city}, {formData.state} – {formData.pincode}</p>
          </div>

          {/* Investment Details */}
          <div className="mb-8">
            <h3 className="font-serif text-lg font-semibold gold-text mb-4 border-b border-gold/20 pb-2">Investment Details</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                ["Investment Amount", "₹50,000"],
                ["No. of Shares", "160 Shares"],
                ["Per Share Value", "₹312.50"],
                ["Minimum Term", "10 Years"],
                ["Commission", "20% on Sale"],
                ["Referral Commission", "25% of 20%"],
                ["Legal Registration Fee", "₹150 (Non-refundable)"],
              ].map(([k, v]) => (
                <div key={k} className={`p-3 rounded border text-center ${k === "Legal Registration Fee" ? "border-gold/40 bg-gold/10" : "border-gold/15 bg-gold/5"}`}>
                  <p className="text-muted-foreground text-xs mb-1">{k}</p>
                  <p className={`font-semibold text-sm ${k === "Legal Registration Fee" ? "text-gold font-bold" : "text-gold"}`}>{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contract Period */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded border border-border bg-secondary/20">
              <p className="text-muted-foreground text-xs uppercase tracking-widest font-semibold mb-1">Contract Start Date</p>
              <p className="text-foreground font-semibold">{formatDate(formData.contractStart)}</p>
            </div>
            <div className="p-4 rounded border border-border bg-secondary/20">
              <p className="text-muted-foreground text-xs uppercase tracking-widest font-semibold mb-1">Contract End / Termination Date</p>
              <p className="text-foreground font-semibold">{formatDate(formData.contractEnd)}</p>
            </div>
          </div>

          {/* Nominee */}
          <div className="mb-8 p-4 rounded border border-border bg-secondary/20">
            <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-3">Nominee Details</p>
            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              <div><p className="text-muted-foreground text-xs">Name</p><p className="text-foreground font-medium">{formData.nomineeName}</p></div>
              <div><p className="text-muted-foreground text-xs">Relationship</p><p className="text-foreground font-medium">{formData.nomineeRelationship}</p></div>
              <div><p className="text-muted-foreground text-xs">Mobile</p><p className="text-foreground font-medium">{formData.nomineePhone}</p></div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="mb-8 p-4 rounded border border-border bg-secondary/20">
            <p className="text-gold text-xs uppercase tracking-widest font-semibold mb-3">Bank Details (For Payout)</p>
            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              <div><p className="text-muted-foreground text-xs">Bank Name</p><p className="text-foreground font-medium">{formData.bankName}</p></div>
              <div><p className="text-muted-foreground text-xs">IFSC Code</p><p className="text-foreground font-medium">{formData.ifscCode}</p></div>
              <div><p className="text-muted-foreground text-xs">Account No.</p><p className="text-foreground font-medium">XXXX{formData.bankAccountNumber?.slice(-4)}</p></div>
            </div>
          </div>

          {/* Referral */}
          {formData.referralName && (
            <div className="mb-8 p-4 rounded border border-blue-500/20 bg-blue-500/5">
              <p className="text-blue-400 text-xs uppercase tracking-widest font-semibold mb-2">Referral Details</p>
              <p className="text-foreground text-sm">{formData.referralName} — {formData.referralPhone}</p>
            </div>
          )}

          {/* Terms & Conditions */}
          <div className="mb-8">
            <h3 className="font-serif text-lg font-semibold gold-text mb-4 border-b border-gold/20 pb-2">Terms &amp; Conditions</h3>
            <div className="space-y-3">
              {TERMS.map((term) =>
                term.highlight ? (
                  <div key={term.id} className="flex gap-3 p-3 rounded border border-gold/40 bg-gold/8">
                    <span className="flex-shrink-0 text-gold font-bold text-sm mt-0.5">★</span>
                    <p className="text-gold text-sm leading-relaxed font-bold">{term.text}</p>
                  </div>
                ) : (
                  <div key={term.id} className="flex gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full border border-gold/30 flex items-center justify-center text-gold text-xs font-bold">
                      {term.id}
                    </span>
                    <p className="text-muted-foreground leading-relaxed">{term.text}</p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Risk Warning */}
          <div className="mb-8 flex gap-3 p-4 rounded border border-amber-500/30 bg-amber-500/5">
            <AlertTriangle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-amber-400/80 text-xs leading-relaxed">
              <strong className="text-amber-400">Risk Disclosure:</strong> This investment is made at the investor's own risk. 
              The underlying company name shall remain undisclosed until withdrawal. No refund or cancellation is permitted before maturity. 
              Legal action may be pursued in case of fraud.
            </p>
          </div>

          {/* Signature Block */}
          <div className="border-t-2 border-gold/30 pt-8 mt-8">
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-widest mb-3">Investor's Digital Signature</p>
                <div className="border-b border-border pb-2 mb-2">
                  <p className="font-serif text-xl text-foreground italic">{formData.signature}</p>
                </div>
                <p className="text-muted-foreground text-xs">{formData.fullName}</p>
                <p className="text-muted-foreground text-xs">{formatDate(formData.contractStart)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-widest mb-3">Co-Applicant</p>
                <div className="border-b border-border pb-2 mb-2">
                  <p className="font-serif text-xl text-foreground italic">Mr. Manoj</p>
                </div>
                <p className="text-muted-foreground text-xs">Co-Applicant & Share Handler</p>
                <p className="text-muted-foreground text-xs">OTI One Time Invest Plan</p>
              </div>
            </div>
          </div>

          {/* Seal */}
          <div className="mt-8 flex items-center justify-center">
            <div className="flex items-center gap-2 px-6 py-3 rounded-full border border-gold/30 bg-gold/5">
              <Shield size={14} className="text-gold" />
              <p className="text-gold text-xs font-semibold uppercase tracking-wider">OTI Official Investment Agreement</p>
              <Shield size={14} className="text-gold" />
            </div>
          </div>
        </div>

        {/* Bottom Action */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 print:hidden">
          <button
            onClick={() => navigate("/apply")}
            className="text-muted-foreground text-sm hover:text-foreground transition-colors"
          >
            ← Edit Application
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => setShowTermsModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 border border-gold/30 text-gold rounded hover:bg-gold/10 transition-colors text-sm"
            >
              <FileText size={14} /> View All Terms
            </button>
            <button
              onClick={handleConfirm}
              className="flex items-center gap-2 px-8 py-3 gold-gradient text-navy-dark font-bold rounded hover:opacity-90 transition-opacity shadow-lg shadow-gold/20"
            >
              <CheckCircle size={16} /> Confirm & Submit Agreement
            </button>
          </div>
        </div>
      </div>
      <WhatsAppButton />
    </div>
  );
}
