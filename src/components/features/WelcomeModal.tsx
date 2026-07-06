import { useState, useEffect, useCallback } from "react";
import { ChevronRight, ChevronLeft, Shield, TrendingUp, Users, Star, ArrowRight, X } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    badge: "Welcome to OTI",
    headline: "Your Future Starts",
    headlineGold: "With One Decision.",
    quote: "The secret to getting ahead is getting started.",
    author: "— Mark Twain",
    sub: "A trusted long-term share investment plan designed to create generational wealth for those who dare to plan ahead.",
    icon: Star,
    accent: "gold",
    visual: "₹",
  },
  {
    id: 2,
    badge: "Long-Term Vision",
    headline: "Plant Today,",
    headlineGold: "Harvest Tomorrow.",
    quote: "Investing in yourself is the best investment you will ever make.",
    author: "— Warren Buffett",
    sub: "OTI is built on the principle that true wealth is created over time — minimum 10 years of disciplined investment for maximum returns.",
    icon: TrendingUp,
    accent: "blue",
    visual: "📈",
  },
  {
    id: 3,
    badge: "Trust & Security",
    headline: "Guided by Expertise,",
    headlineGold: "Protected by Law.",
    quote: "Risk comes from not knowing what you're doing. Knowledge bridges risk and reward.",
    author: "— Warren Buffett",
    sub: "With Co-Applicant Mr. Manoj managing your shares, every rupee is handled with professional care and legal agreement.",
    icon: Shield,
    accent: "emerald",
    visual: "🛡️",
  },
  {
    id: 4,
    badge: "Limited Community",
    headline: "6,000 Seats.",
    headlineGold: "One Opportunity.",
    quote: "Opportunities don't happen. You create them. But when they appear — seize them.",
    author: "— Chris Grosser",
    sub: "Only 6,000 applications are accepted. Each seat represents ₹50,000 invested into 160 shares.",
    icon: Users,
    accent: "purple",
    visual: "🏆",
  },
  {
    id: 5,
    badge: "Begin Your Journey",
    headline: "The Wealth You",
    headlineGold: "Deserve Is Waiting.",
    quote: "Do not save what is left after spending, but spend what is left after saving.",
    author: "— Warren Buffett",
    sub: "You've seen the vision. Now it's time to act. Secure your seat in the OTI family today.",
    icon: ArrowRight,
    accent: "gold",
    visual: "🌟",
    isFinal: true,
  },
];

const accentMap = {
  gold: {
    badge: "border-[#c9a84c]/40 bg-[#c9a84c]/10 text-[#f5d78a]",
    dot: "bg-[#c9a84c]",
    btn: "gold-gradient text-navy-dark",
    bar: "bg-[#c9a84c]",
    text: "gold-text",
    glow: "bg-[#c9a84c]/15",
    border: "border-[#c9a84c]/40",
  },
  blue: {
    badge: "border-blue-400/30 bg-blue-400/10 text-blue-300",
    dot: "bg-blue-400",
    btn: "bg-blue-600 text-white hover:bg-blue-700",
    bar: "bg-blue-400",
    text: "text-blue-400",
    glow: "bg-blue-500/10",
    border: "border-blue-400/30",
  },
  emerald: {
    badge: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    dot: "bg-emerald-400",
    btn: "bg-emerald-600 text-white hover:bg-emerald-700",
    bar: "bg-emerald-400",
    text: "text-emerald-400",
    glow: "bg-emerald-500/10",
    border: "border-emerald-400/30",
  },
  purple: {
    badge: "border-purple-400/30 bg-purple-400/10 text-purple-300",
    dot: "bg-purple-400",
    btn: "bg-purple-600 text-white hover:bg-purple-700",
    bar: "bg-purple-400",
    text: "text-purple-400",
    glow: "bg-purple-500/10",
    border: "border-purple-400/30",
  },
};

interface WelcomeModalProps {
  onClose: () => void;
}

export default function WelcomeModal({ onClose }: WelcomeModalProps) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const slide = SLIDES[current];
  const accent = accentMap[slide.accent as keyof typeof accentMap];

  const goTo = useCallback(
    (index: number, dir: "next" | "prev") => {
      if (animating || index === current) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setAnimating(false);
      }, 300);
    },
    [animating, current]
  );

  const next = useCallback(() => {
    if (current < SLIDES.length - 1) goTo(current + 1, "next");
  }, [current, goTo]);

  const prev = () => {
    if (current > 0) goTo(current - 1, "prev");
  };

  // Auto-advance (pause on last slide)
  useEffect(() => {
    if (current === SLIDES.length - 1) return;
    const t = setTimeout(next, 5000);
    return () => clearTimeout(t);
  }, [current, next]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current, animating]);

  const handleEnter = () => {
    localStorage.setItem("oti_welcomed", "true");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleEnter}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl flex flex-col"
        style={{
          background: "linear-gradient(160deg, #070d1f 0%, #0d1428 60%, #070d1f 100%)",
          border: "1px solid rgba(201,168,76,0.25)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.8), 0 0 60px rgba(201,168,76,0.08)",
        }}
      >
        {/* Ambient glow */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full blur-3xl opacity-40 pointer-events-none transition-all duration-700 ${accent.glow}`}
        />

        {/* Close button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleEnter}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-gold/40 transition-colors text-xs"
          >
            <X size={14} />
          </button>
        </div>

        {/* Content */}
        <div className="relative p-6 sm:p-8 pt-8">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-widest mb-5 ${accent.badge}`}>
            {slide.badge}
          </div>

          {/* Slide content with animation */}
          <div
            className="transition-all duration-300"
            style={{
              opacity: animating ? 0 : 1,
              transform: animating
                ? direction === "next" ? "translateX(20px)" : "translateX(-20px)"
                : "translateX(0)",
            }}
          >
            {/* Visual */}
            <div className="text-5xl mb-4 select-none">{slide.visual}</div>

            {/* Headline */}
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight mb-4">
              <span className="text-foreground">{slide.headline}</span>
              <br />
              <span className={accent.text}>{slide.headlineGold}</span>
            </h2>

            {/* Quote */}
            <div className={`border-l-4 pl-4 mb-4 ${accent.border}`}>
              <p className="text-foreground/90 text-base font-serif italic leading-relaxed">
                "{slide.quote}"
              </p>
              <p className={`text-xs font-semibold mt-1.5 ${accent.text}`}>{slide.author}</p>
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {slide.sub}
            </p>

            {/* Final CTA button */}
            {(slide as typeof SLIDES[0] & { isFinal?: boolean }).isFinal && (
              <button
                onClick={handleEnter}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded font-bold text-base transition-opacity hover:opacity-90 shadow-lg mb-4 ${accent.btn}`}
              >
                Enter OTI Platform <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="px-6 sm:px-8 pb-6 flex flex-col items-center gap-4">
          {/* Progress dots */}
          <div className="flex gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? "next" : "prev")}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === current ? `w-8 ${accent.bar}` : "w-3 bg-border hover:bg-muted-foreground"
                }`}
              />
            ))}
          </div>

          {/* Prev / Next */}
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={prev}
              disabled={current === 0}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-gold/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex-1 text-center">
              <span className="text-muted-foreground text-xs font-mono">
                {current + 1} / {SLIDES.length}
              </span>
            </div>

            {current < SLIDES.length - 1 ? (
              <button
                onClick={next}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded font-semibold text-sm transition-opacity hover:opacity-90 flex-shrink-0 ${accent.btn}`}
              >
                Next <ChevronRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleEnter}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded font-semibold text-sm gold-gradient text-navy-dark hover:opacity-90 transition-opacity flex-shrink-0"
              >
                Enter <ArrowRight size={14} />
              </button>
            )}
          </div>

          {/* Skip */}
          <button
            onClick={handleEnter}
            className="text-muted-foreground hover:text-foreground text-xs transition-colors"
          >
            Skip intro →
          </button>
        </div>
      </div>
    </div>
  );
}
