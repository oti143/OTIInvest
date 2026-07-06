import { X, FileText, AlertCircle } from "lucide-react";
import { TERMS } from "@/constants";

interface TermsModalProps {
  onClose: () => void;
}

export default function TermsModal({ onClose }: TermsModalProps) {
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #070d1f 0%, #0d1428 100%)",
          border: "1px solid rgba(201,168,76,0.3)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.8), 0 0 40px rgba(201,168,76,0.06)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gold/20 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 gold-gradient rounded flex items-center justify-center flex-shrink-0">
              <FileText size={16} className="text-navy-dark" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold gold-text leading-tight">Terms & Conditions</h2>
              <p className="text-muted-foreground text-xs">OTI – One Time Invest Plan ({TERMS.length} clauses)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded border border-border text-muted-foreground hover:text-foreground hover:border-gold/40 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {TERMS.map((term) =>
            term.highlight ? (
              /* Highlighted legal charge term */
              <div
                key={term.id}
                className="flex gap-3 p-4 rounded-lg border border-gold/50 bg-gold/10"
              >
                <AlertCircle size={18} className="text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gold text-xs font-bold uppercase tracking-widest mb-1">Important Notice</p>
                  <p className="text-foreground text-sm leading-relaxed font-semibold">{term.text}</p>
                </div>
              </div>
            ) : (
              <div key={term.id} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full border border-gold/30 bg-gold/5 flex items-center justify-center text-gold text-xs font-bold mt-0.5">
                  {term.id}
                </span>
                <p className="text-muted-foreground text-sm leading-relaxed">{term.text}</p>
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gold/15 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 gold-gradient text-navy-dark font-bold rounded hover:opacity-90 transition-opacity text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
