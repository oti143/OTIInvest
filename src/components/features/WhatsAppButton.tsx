import { MessageCircle } from "lucide-react";

const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi, I would Like to invest in the OTI, Can I get the details Regarding to this"
);
const WHATSAPP_NUMBER = "917026984838";

export default function WhatsAppButton() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 group"
    >
      {/* Tooltip */}
      <span className="hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-navy-dark border border-gold/20 text-foreground text-xs px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
        Chat with us on WhatsApp
      </span>

      {/* Button */}
      <div className="relative w-14 h-14 flex items-center justify-center rounded-full shadow-xl transition-transform duration-200 hover:scale-110 active:scale-95"
        style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full animate-ping opacity-30"
          style={{ background: "radial-gradient(circle, #25D366, transparent)" }}
        />
        <MessageCircle size={28} className="text-white relative z-10" fill="white" strokeWidth={0} />
      </div>
    </a>
  );
}
